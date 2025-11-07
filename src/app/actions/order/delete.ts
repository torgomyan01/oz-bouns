"use server";

import { prisma } from "@/lib/prisma";

export type DeleteOrderResponse = {
  ok: boolean;
  message?: string;
};

export async function deleteOrderAction(
  orderId: number,
): Promise<DeleteOrderResponse> {
  try {
    await prisma.orders.delete({
      where: {
        id: orderId,
      },
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ջնջել պատվերը",
    };
  }
}
