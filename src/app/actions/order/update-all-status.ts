"use server";

import { prisma } from "@/lib/prisma";

export type UpdateAllOrdersStatusResponse = {
  ok: boolean;
  message?: string;
};

export async function updateAllOrdersStatusAction(
  userId: number,
  status: "pending" | "completed",
): Promise<UpdateAllOrdersStatusResponse> {
  try {
    await prisma.orders.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        status: status,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց փոփոխել բոլոր պատվերների ստատուսը",
    };
  }
}
