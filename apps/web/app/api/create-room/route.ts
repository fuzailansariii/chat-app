import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    const roomName = name.trim();
    return NextResponse.json({
      RoomName: roomName,
    });
  } catch (error) {
    console.error("something went wrong");
  }
}
