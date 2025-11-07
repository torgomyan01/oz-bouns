"use server";

import { prisma } from "@/lib/prisma";

export type GetOrdersByUserResponse = {
  ok: boolean;
  data?: IOrder[];
  message?: string;
};

export async function getOrdersByUserIdAction(
  userId: number,
): Promise<GetOrdersByUserResponse> {
  try {
    const orders = await prisma.orders.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      ok: true,
      data: orders as IOrder[],
    };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ստանալ պատվերները",
    };
  }
}
