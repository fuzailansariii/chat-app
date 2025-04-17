import { decode } from "next-auth/jwt";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

async function checkUser({ token }: { token: string }) {
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
  const userId = decodedToken.id;
  return userId;
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

    // WebSocket message handling
    ws.on("message", (message) => {
      console.log("📩 Received message:", message.toString());
      ws.send(`Pong ${userId}`);
    });

    ws.on("close", (code, reason) => {
      console.log(
        `🔴 User ${userId} disconnected (Code: ${code}, Reason: ${reason})`
      );
    });

    ws.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
    });
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    ws.close(1011, "Internal Server Error");
  }
});
