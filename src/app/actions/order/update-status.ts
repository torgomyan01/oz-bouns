"use server";

import { prisma } from "@/lib/prisma";

export type UpdateOrderStatusResponse = {
  ok: boolean;
  data?: IOrder;
  message?: string;
};

export async function updateOrderStatusAction(
  orderId: number,
  status: "pending" | "completed",
): Promise<UpdateOrderStatusResponse> {
  try {
    const order = await prisma.orders.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });

    return {
      ok: true,
      data: order as IOrder,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց փոփոխել պատվերի ստատուսը",
    };
  }
}
