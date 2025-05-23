import NextAuth from "next-auth";
import { authOptions } from "@repo/auth/options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
