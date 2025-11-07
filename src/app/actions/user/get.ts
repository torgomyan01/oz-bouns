"use server";

import { prisma } from "@/lib/prisma";
import { User } from "./list";

export type GetUserResponse = {
  ok: boolean;
  data?: User;
  message?: string;
};

export async function getUserByIdAction(id: number): Promise<GetUserResponse> {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone_number: true,
        card_number: true,
        bank_name: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }

    return { ok: true, data: user };
  } catch (error) {
    return {
      ok: false,
      message: "Չհաջողվեց ստանալ օգտատիրոջը",
    };
  }
}
