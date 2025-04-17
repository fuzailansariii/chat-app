import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { auth } from "@repo/auth/checkAuth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    // const userId = session.user.id;
    const response = await prisma.room.findMany();
    // console.log("response: ", response);
    return NextResponse.json(
      {
        success: true,
        message: "Room fetched successfully",
        rooms: response,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
