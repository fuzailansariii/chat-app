import prisma from "@repo/db/client";

export async function getRoomByJoiningId(joiningId: string) {
  return await prisma.room.findUnique({
    where: { joiningId },
  });
}
