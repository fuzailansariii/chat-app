import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { authSocketMiddleware } from "./socket/authSocketMiddleware";
import { joinRoomHandler } from "./handlers/joinRoom";
import { MessageHandler } from "./handlers/message";
import { disconnectHandler } from "./handlers/disconnect";

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.use(authSocketMiddleware);

io.on("connection", (socket) => {
  console.log(`User ${socket.data.userId} connected`);
  joinRoomHandler(io, socket);
  MessageHandler(io, socket);
  disconnectHandler(socket);
});

httpServer.listen(8080, () => {
  console.log("Socket.IO is running on port 8080");
});
