"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export type ChangePasswordResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const changePasswordSchema = z.object({
  id: z.number(),
  oldPassword: z.string().min(1, "Հին գաղտնաբառը պարտադիր է"),
  newPassword: z
    .string()
    .min(6, "Նոր գաղտնաբառը պետք է լինի առնվազն 6 նիշ")
    .max(100, "Նոր գաղտնաբառը չի կարող լինել 100 նիշից ավելի"),
});

export async function changePasswordAction(
  data: z.infer<typeof changePasswordSchema>,
): Promise<ChangePasswordResponse> {
  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Վավերացման սխալ",
      fieldErrors,
    };
  }

  const { id, oldPassword, newPassword } = parsed.data;

  try {
    // Get user with password
    const user = await prisma.users.findUnique({
      where: { id },
      select: { id: true, password: true },
    });

    if (!user) {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }

    // Verify old password
    if (!user.password) {
      return {
        ok: false,
        message: "Օգտատերը չունի գաղտնաբառ",
      };
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return {
        ok: false,
        message: "Հին գաղտնաբառը սխալ է",
        fieldErrors: {
          oldPassword: "Հին գաղտնաբառը սխալ է",
        },
      };
    }

    // Check if new password is different from old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return {
        ok: false,
        message: "Նոր գաղտնաբառը պետք է տարբերվի հինից",
        fieldErrors: {
          newPassword: "Նոր գաղտնաբառը պետք է տարբերվի հինից",
        },
      };
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { ok: true, message: "Գաղտնաբառը հաջողությամբ փոփոխվեց" };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }
    return {
      ok: false,
      message: "Չհաջողվեց փոփոխել գաղտնաբառը",
    };
  }
}
