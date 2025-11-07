"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type ResetPasswordResponse = {
  ok: boolean;
  passwordPlain?: string;
  message?: string;
};

async function generatePassword(): Promise<string> {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const length = 10;
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return pass;
}

async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function resetPasswordAction(
  id: number,
): Promise<ResetPasswordResponse> {
  try {
    const passwordPlain = await generatePassword();
    const password = await hashPassword(passwordPlain);

    await prisma.users.update({
      where: { id },
      data: { password },
    });

    return { ok: true, passwordPlain };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }
    return {
      ok: false,
      message: "Չհաջողվեց վերականգնել գաղտնաբառը",
    };
  }
}
