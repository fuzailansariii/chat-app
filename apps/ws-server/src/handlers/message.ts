import prisma from "@repo/db/client";
import redis from "@repo/redis/index";
import { Server, Socket } from "socket.io";

export const MessageHandler = async (io: Server, socket: Socket) => {
  try {
    socket.on("message", async ({ roomId, message }) => {
      try {
        const isMember = await redis.sismember(
          `room:${roomId}:users`,
          socket.data.userId
        );
        if (!isMember) {
          return socket.emit("error", "You are not a room member");
        }

        const msg = {
          roomId,
          userId: socket.data.userId,
          message,
          timestamp: Date.now(),
        };

        // Broadcast message to the room
        io.to(roomId).emit("new_message", msg);
        await prisma.chat.create({
          data: {
            message: message,
            roomId: roomId,
            userId: socket.data.userId,
          },
        });
      } catch (error) {
        console.error("Error in message handler:", error);
        socket.emit("error", "Message processing failed");
      }
    });
  } catch (error) {
    console.error("Error in MessageHandler:", error);
  }
};
