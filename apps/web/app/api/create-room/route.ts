import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import generateId from "../../utils/GenerateUniqueId";
import { auth } from "@repo/auth/checkAuth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Room Name is required",
        },
        { status: 400 }
      );
    }

    const uniqueId = generateId().toUpperCase();
    const roomName = name.trim();

    const room = await prisma.room.create({
      data: {
        name: roomName,
        createdBy: userId,
        joiningId: uniqueId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully",
        room: {
          roomJoiningId: room.joiningId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("something went wrong");
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
