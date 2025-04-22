import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { auth } from "@repo/auth/checkAuth";
import { GetRoomId } from "../../../utils/getRoomId";

export async function GET(
  req: NextRequest,
  { params }: { params: { joiningId: string } }
) {
  // Extract joiningId from params (already a string)

  try {
    const { error, room } = await GetRoomId(params.joiningId);
    if (error) {
      return error;
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
