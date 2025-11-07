"use server";

import { prisma } from "@/lib/prisma";

export type User = {
  id: number;
  name: string;
  phone_number: string;
  card_number: string;
  bank_name: string;
};

export type GetUsersResponse = {
  ok: boolean;
  data?: User[];
  message?: string;
};

export async function getUsersAction(): Promise<GetUsersResponse> {
  try {
    const users = await prisma.users.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        phone_number: true,
        card_number: true,
        bank_name: true,
      },
    });
    return { ok: true, data: users };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ստանալ օգտատերերին",
    };
  }
}
