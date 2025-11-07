"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export type CreateUserState = {
  ok: boolean;
  message?: string;
  phone?: string;
  passwordPlain?: string;
  fieldErrors?: Record<string, string>;
};

const formSchema = z.object({
  name: z.string().trim().min(1, "Անունը պարտադիր է"),
  phone_number: z
    .string()
    .trim()
    .regex(/^0\d{8}$/, "Հեռախոսահամարի ֆորմատը պետք է լինի՝ 0XXXXXXXX"),
  card_number: z.string().trim().min(1, "Քարտի համարը պարտադիր է"),
  bank_name: z.string().trim().min(1, "Բանկի անունը պարտադիր է"),
});

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

export async function createUserAction(
  _prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const raw = {
    name: String(formData.get("name") || ""),
    phone_number: String(formData.get("phone_number") || ""),
    card_number: String(formData.get("card_number") || ""),
    bank_name: String(formData.get("bank_name") || ""),
  };

  const parsed = formSchema.safeParse(raw);
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

  const { name, phone_number, card_number, bank_name } = parsed.data;

  // Unique phone check
  const existing = await prisma.users.findFirst({
    where: { phone_number },
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

  const passwordPlain = await generatePassword();
  const password = await hashPassword(passwordPlain);

  try {
    await prisma.users.create({
      data: {
        name,
        phone_number,
        card_number,
        bank_name,
        password,
      },
    });

    return {
      ok: true,
      message: "Օգտատերը հաջողությամբ ավելացվեց",
      phone: phone_number,
      passwordPlain,
    };
  } catch (error: any) {
    // Handle unique constraint violation
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
      message: "Սխալ է տեղի ունեցել օգտատիրոձ ստեղծման ժամանակ",
    };
  }
}
