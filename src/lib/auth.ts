// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    Credentials({
      name: "Phone & Password",
      credentials: {
        phone_number: { label: "Հեռախոսահամար", type: "text" },
        password: { label: "Գաղտնաբառ", type: "password" },
      },
      async authorize(creds) {
        const phone_number = String(creds?.phone_number ?? "").trim();
        const password = String(creds?.password ?? "");

        if (!phone_number || !password) {
          return null;
        }

        // Find user by phone number
        const user: any = await prisma.users.findFirst({
          where: { phone_number },
        });

        console.log(user);

        if (!user) {
          return null;
        }

        // Verify password
        const ok = await bcrypt.compare(password, user.password ?? "");
        if (!ok) {
          return null;
        }

        // Remove sensitive fields
        const { password: _pw, ...userSafe } = user;

        return {
          ...userSafe,
          name: userSafe.name ?? userSafe.phone_number,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = String((user as any).id ?? token.sub);
        token.name = (user as any).name;
        token.phone_number = (user as any).phone_number;

        // Attach full user payload (without password) for session consumption
        (token as any).user = user as any;
      }

      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
        }
        if ((session as any).phone_number) {
          token.phone_number = (session as any).phone_number;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).name = token.name;
        (session.user as any).phone_number = (token as any).phone_number;

        // Merge all user fields (sans password) into session.user
        if ((token as any).user) {
          Object.assign(session.user as any, (token as any).user);
          // Ensure password is not present even if somehow included
          delete (session.user as any).password;
        }
      }
      return session;
    },
  },
};
