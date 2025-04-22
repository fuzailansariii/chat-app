import { decode } from "next-auth/jwt";
import * as dotenv from "dotenv";
dotenv.config();

export async function checkUser({
  token,
  secret,
}: {
  token: string;
  secret: string;
}) {
  try {
    const decodedToken = await decode({ token, secret });
    if (!decodedToken || !decodedToken.id) {
      console.error("❌ Invalid or expired token");
      return null;
    }
    const userId = String(decodedToken.id);
    return userId;
  } catch (error) {
    console.error("Error in checkUser:", error);
    return null;
  }
}
