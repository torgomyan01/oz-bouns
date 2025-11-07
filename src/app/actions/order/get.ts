"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionGetUserOrders(
  status: "pending" | "completed" = "pending",
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [] };
    }

    const orders = await prisma.orders.findMany({
      where: {
        user_id: session.user.id as number,
        status: status,
      },
      orderBy: {
        created_at: "desc",
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
