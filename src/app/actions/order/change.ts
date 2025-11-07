"use server";

import { prisma } from "@/lib/prisma";

export async function ActionChangeOrderStatus(orderId: string, id: number) {
  try {
    const orders = await prisma.orders.update({
      where: {
        id: id,
      },
      data: {
        order_number: orderId,
      },
    });

    return {
      status: "ok",
      data: orders,
    };
  } catch {
    return { status: "error", data: [] };
  }
}
