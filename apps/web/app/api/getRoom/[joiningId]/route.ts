import { NextRequest, NextResponse } from "next/server";
import { GetRoomId } from "../../../utils/getRoomId";

export async function GET(
  req: NextRequest,
  { params }: { params: { joiningId: string } }
) {
  const { error, room } = await GetRoomId(params.joiningId);
  if (error) {
    return error;
  }
  return NextResponse.json({
    success: true,
    message: "Room fetched successfully",
    roomData: room,
  });
}
