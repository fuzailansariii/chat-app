import { decode } from "next-auth/jwt";
import dotenv from "dotenv";
dotenv.config();

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
