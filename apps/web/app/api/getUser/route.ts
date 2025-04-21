import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@repo/auth/options";
import { decode, getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json(
      { success: false, message: "User is not logged in" },
      { status: 401 }
    );
  }

  try {
    const AuthSecret = process.env.NEXTAUTH_SECRET;

    if (!AuthSecret) {
      return NextResponse.json({
        success: false,
        message: "Invalid auth secret",
      });
    }

    // Get the raw token
    const rawToken = await getToken({
      req,
      secret: AuthSecret,
      raw: true,
    });

    if (!rawToken) {
      return NextResponse.json(
        { success: false, message: "No token found" },
        { status: 401 }
      );
    }

    const decoded = await decode({
      token: rawToken,
      secret: AuthSecret,
    });

    return NextResponse.json({
      success: true,
      user: session.user,
      rawToken: rawToken,
      decodedToken: decoded ?? "Decryption failed",
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process token",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
