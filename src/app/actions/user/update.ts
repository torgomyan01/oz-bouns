"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

export type UpdateUserResponse = {
  ok: boolean;
  data?: {
    id: number;
    name: string;
    phone_number: string;
    card_number: string;
    bank_name: string;
  };
  message?: string;
  fieldErrors?: Record<string, string>;
};

const updateSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1, "Անունը պարտադիր է"),
  phone_number: z
    .string()
    .trim()
    .regex(/^0\d{8}$/, "Հեռախոսահամարի ֆորմատը պետք է լինի՝ 0XXXXXXXX"),
  card_number: z.string().trim().min(1, "Քարտի համարը պարտադիր է"),
  bank_name: z.string().trim().min(1, "Բանկի անունը պարտադիր է"),
});

export async function updateUserAction(
  data: z.infer<typeof updateSchema>,
): Promise<UpdateUserResponse> {
  const parsed = updateSchema.safeParse(data);
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

  const { id, name, phone_number, card_number, bank_name } = parsed.data;

  // Check if phone number is already taken by another user
  const existing = await prisma.users.findFirst({
    where: {
      phone_number,
      NOT: { id },
    },
  });

  if (existing) {
    return {
      ok: false,
      message: "Այս հեռախոսահամարով օգտատեր արդեն կա",
      fieldErrors: {
        phone_number: "Այս հեռախոսահամարով օգտատեր արդեն կա",
      },
    };
  }

  try {
    const updated = await prisma.users.update({
      where: { id },
      data: { name, phone_number, card_number, bank_name },
      select: {
        id: true,
        name: true,
        phone_number: true,
        card_number: true,
        bank_name: true,
      },
    });

    return { ok: true, data: updated };
  } catch (error: any) {
    if (error.code === "P2025") {
      return {
        ok: false,
        message: "Օգտատերը չի գտնվել",
      };
    }
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("phone_number")
    ) {
      return {
        ok: false,
        message: "Այս հեռախոսահամարով օգտատեր արդեն կա",
        fieldErrors: {
          phone_number: "Հեռախոսահամարը պետք է լինի յուրահատուկ",
        },
      };
    }
    return {
      ok: false,
      message: "Չհաջողվեց թարմացնել օգտատիրոջը",
    };
  }
}
