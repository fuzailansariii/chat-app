import { decode } from "next-auth/jwt";
import { WebSocketServer, WebSocket } from "ws";
import prisma from "@repo/db/client";
import dotenv from "dotenv";
import redis from "@repo/redis/index";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

const socketUserMap = new Map<WebSocket, { userId: string }>();
const clientSubscriptions = new Map<WebSocket, Set<string>>();

export async function checkUser({ token }: { token: string }) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret || !token) {
    console.error("❌ Missing NEXTAUTH_SECRET");
    // ws.close(1011, "Server Configuration Error");
    return null;
  }
  const decodedToken = await decode({ token, secret });
  if (!decodedToken || !decodedToken.id) {
    console.error("❌ Invalid or expired token");
    return null;
  }
  const userId = String(decodedToken.id);
  return userId;
}
export async function getRoomByJoiningId(joiningId: string) {
  return await prisma.room.findUnique({
    where: { joiningId },
  });
}

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
        await redis.sadd(`room:${roomId}`, userId);
        // if (!clientSubscriptions.has(ws)) {
        //   clientSubscriptions.set(ws, new Set());
        // }
        // clientSubscriptions.get(ws)!.add(roomId);
        clientSubscriptions.get(ws)?.add(roomId);

        ws.send(`Joined room ${roomId}`);
      }

      if (data.type === "message") {
        const { roomId, message: userMessage } = data;

        if (!roomId || !message) {
          return ws.send("Missing roomId or Message");
        }
        const isMember = await redis.sismember(`room:${roomId}`, userId);
        if (!isMember) {
          return ws.send("You are not part of this room");
        }

        // Brodcast message to all the sockets in this room.
        for (const [client, subsribedRooms] of clientSubscriptions.entries()) {
          if (subsribedRooms.has(userId)) {
            const sender = socketUserMap.get(ws);
            client.send(
              JSON.stringify({
                type: "new_message",
                roomId,
                from: sender?.userId,
                message: userMessage,
              })
            );
          }
        }
      }
    });

    ws.on("close", (code, reason) => {
      console.log(
        `🔴 User ${userId} disconnected (Code: ${code}, Reason: ${reason})`
      );
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
