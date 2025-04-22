import { ExtendedError, Socket } from "socket.io";
import { checkUser } from "./checkAuth";

export const authSocketMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("❌ Missing NEXTAUTH_SECRET");
      return null;
    }
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("No token provided"));
    }
    const userId = await checkUser({ token, secret });
    if (!userId) {
      return next(new Error("Invalid token"));
    }
    socket.data.userId = userId;
    next();
  } catch (error) {
    console.error("Auth Error: ", error);
    next(new Error("Internal server error"));
  }
};
