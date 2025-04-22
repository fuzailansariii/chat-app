import { Socket, Server } from "socket.io";
import { getRoomByJoiningId } from "../socket/getRoom";
import redis from "@repo/redis/index";

export const joinRoomHandler = async (io: Server, socket: Socket) => {
  socket.on("join_room", async ({ joiningId }) => {
    try {
      const room = await getRoomByJoiningId(joiningId);
      if (!room) {
        return socket.emit("error", "Room not found");
      }
      const roomId = room.id;
      socket.join(roomId);
      await redis.sadd(`room:${roomId}:users`, socket.data.userId);
      socket.emit("joined_room", { roomId });
      socket.to(roomId).emit("user_joined", { userId: socket.data.userId });
    } catch (error) {
      console.error("Error in joinRoomHandler:", error);
      socket.emit("error", "Failed to join room");
    }
  });
};
