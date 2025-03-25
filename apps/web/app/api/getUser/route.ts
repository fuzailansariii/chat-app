import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@repo/auth/options";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the session user
    return NextResponse.json({ user: session.user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
