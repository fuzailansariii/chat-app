import { auth } from "@repo/auth/checkAuth";
import { jsonResponse } from "./jsonResponse";
import prisma from "@repo/db/client";

export async function GetRoomId(joiningId: string) {
  if (!joiningId || joiningId.trim() === "") {
    return {
      error: jsonResponse(
        {
          success: false,
          message: "Invalid or missing joiningId",
        },
        400
      ),
      room: null,
    };
  }

  // Authenticate the user
  try {
    const session = await auth();
    if (!session) {
      return {
        error: jsonResponse(
          {
            success: false,
            message: "Unauthorized",
          },
          401
        ),
        room: null,
      };
    }

    // Try to find the room using the joiningId
    const room = await prisma.room.findUnique({
      where: {
        joiningId,
      },
    });

    // If no room is found, return 404
    if (!room) {
      return {
        error: jsonResponse(
          {
            success: false,
            message: "No rooms found with the given joiningId",
            data: null,
          },
          404
        ),
        room: null,
      };
    }

    // Success: return the room object and no error
    return { error: null, room };
  } catch (error) {
    return {
      error: jsonResponse(
        {
          success: false,
          message: "Internal server error",
        },
        500
      ),
      room: null,
    };
  }
}
