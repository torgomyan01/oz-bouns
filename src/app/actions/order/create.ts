"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionCreateOrder(orderId: string) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "logout" };
    }

    const order = await prisma.orders.findFirst({
      where: {
        order_number: orderId,
      },
    });

    if (order) {
      return {
        status: "error",
        message: "Այս պատվերը արդեն ավելացված է",
      };
    }

    await prisma.orders.create({
      data: {
        user_id: session.user.id as number,
        order_number: orderId,
        status: "pending",
      },
    });

    return {
      status: "ok",
      message: "Պատվերը հաջողությամբ ավելացվեց",
    };
  } catch {
    return {
      status: "error",
      message: "Սխալ է տեղի ունեցել. Խնդրում ենք փորձել կրկին",
    };
  }
}
