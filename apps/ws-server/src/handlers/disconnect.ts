import redis from "@repo/redis/index";
import { Socket } from "socket.io";

export const disconnectHandler = async (socket: Socket) => {
  socket.on("disconnect", async () => {
    try {
      console.log(`Disconnected ${socket.data.userId}`);
      const rooms = [...socket.rooms].filter((r) => r !== socket.id);

      for (const roomId of rooms) {
        try {
          await redis.srem(`room:${roomId}:users`, socket.data.userId);
          socket.to(roomId).emit("user_left", { userId: socket.data.userId });
        } catch (error) {
          console.error(`Failed to remove user from room ${roomId}:`, error);
        }
      }
    } catch (error) {
      socket.emit("error", "Failed to process disconnect");
      console.error("Error in disconnectHandler:", error);
    }
  });
};
