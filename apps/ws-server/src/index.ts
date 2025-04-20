import { WebSocketServer } from "ws";
import prisma from "@repo/db/client";
import dotenv from "dotenv";
import redis from "@repo/redis/index";
import { clientSubscriptions, socketUserMap } from "./utils/map";
import { getRoomByJoiningId } from "./utils/getRoom";
import { checkUser } from "./utils/checkAuth";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", async (ws, request) => {
  const url = request.url;
  if (!url) {
    console.error("❌ Missing URL in request");
    ws.close(1008, "Invalid request");
    return;
  }

  // Extract token from URL
  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token");

  if (!token) {
    console.error("❌ Token missing in query params");
    ws.close(1008, "Unauthorized");
    return;
  }

  try {
    //  Decode and verify token
    const userId = await checkUser({ token });

    if (!userId) {
      ws.close(1008, "Unauthorized");
      return;
    }

    console.log(`User ${userId} connected`);

    // adding user to the socketUserMap after verifying authenticated user
    socketUserMap.set(ws, { userId });
    clientSubscriptions.set(ws, new Set());
    const subscriber = redis.duplicate();

    // WebSocket message handling
    ws.on("message", async (message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch {
        return ws.send("Invalid message format");
      }

      const session = socketUserMap.get(ws);

      if (!session) {
        return ws.send("Session not found");
      }
      const { userId } = session;
      if (data.type === "join_room") {
        const joiningId = data.joiningId;

        const room = await getRoomByJoiningId(joiningId);
        if (!room) {
          return ws.send("❌ Room not found");
        }
        // extract roomId
        const roomId = room.id;
        await redis.sadd(`room:${roomId}:users`, userId);
        if (!clientSubscriptions.get(ws)!.has(roomId)) {
          await subscriber.subscribe(`room:${roomId}`);
          clientSubscriptions.get(ws)!.add(roomId);
        }

        ws.send(`Joined roomId: ${roomId}`);
      }

      if (data.type === "message") {
        const { roomId, message: content } = data;

        if (!roomId || !content) {
          return ws.send("Missing roomId or content");
        }

        const isMember = await redis.sismember(`room:${roomId}:users`, userId);
        if (!isMember) {
          return ws.send("You are not part of this room");
        }

        const msg = JSON.stringify({
          type: "new_message", // Kept to match your frontend
          roomId,
          userId,
          message: content,
          timestamp: Date.now(),
        });
        await redis.publish(`room:${roomId}`, msg);

        await prisma.chat.create({
          data: {
            roomId,
            userId,
            message: content,
          },
        });
      }
    });

    subscriber.on("message", (channel, message) => {
      ws.send(message);
    });

    ws.on("close", async () => {
      console.log(`🔴 User ${userId} disconnected`);
      const rooms = clientSubscriptions.get(ws) || new Set();
      for (const roomId of rooms) {
        await redis.srem(`room:${roomId}:users`, userId);
        const leaveMsg = JSON.stringify({
          type: "user_left",
          userId,
          roomId,
          timestamp: Date.now(),
        });
        await redis.publish(`room:${roomId}`, leaveMsg);
      }
      await subscriber.unsubscribe();
      await subscriber.quit();
      socketUserMap.delete(ws);
      clientSubscriptions.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    ws.close(1011, "Internal Server Error");
  }
});
