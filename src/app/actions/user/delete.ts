"use server";

import { prisma } from "@/lib/prisma";

export type DeleteUserResponse = {
  ok: boolean;
  message?: string;
};

export async function deleteUserAction(
  id: number,
): Promise<DeleteUserResponse> {
  try {
    await prisma.users.delete({
      where: { id },
    });
    return { ok: true };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }
    return {
      ok: false,
      message: "Չհաջողվեց ջնջել օգտատիրոջը",
    };
  }
}
