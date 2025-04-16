import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { auth } from "@repo/auth/checkAuth";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    await prisma.room.deleteMany({
      where: {
        createdBy: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Rooms deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Interval server error",
      },
      { status: 500 }
    );
  }
}
