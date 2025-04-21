import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { auth } from "@repo/auth/checkAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { joiningId: string } }
) {
  // Extract joiningId from params (already a string)
  const joiningId = params.joiningId;

  // Validate joiningId (ensure it's not empty)
  if (!joiningId || joiningId.trim() === "") {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or missing joiningId",
        joiningId: null,
      },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  // const userId = session.user.id;

  try {
    // Query the database using Prisma, treating joiningId as a string
    const room = await prisma.room.findUnique({
      where: {
        joiningId: joiningId, // Assuming the id field in your database is a string
      },
    });

    // Check if rooms were found
    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "No rooms found with the given joiningId",
          data: null,
        },
        { status: 404 }
      );
    }

    const roomId = room.id;

    const chats = await prisma.chat.findMany({
      where: {
        roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 20,
    });

    if (!chats || chats.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No message in this room",
          roomId: roomId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "message fetched successfully",
        messages: chats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
