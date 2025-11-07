import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// Check if NEXTAUTH_SECRET is available
const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

// Error handler for when NEXTAUTH_SECRET is missing
const errorHandler = () => {
  return NextResponse.json(
    {
      error: "Configuration",
      message:
        "NEXTAUTH_SECRET is not set. Please add it to your environment variables in Vercel.",
    },
    { status: 500 },
  );
};

// NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

// Export handlers based on NEXTAUTH_SECRET availability
export const GET = hasNextAuthSecret
  ? nextAuthHandler
  : (errorHandler as typeof nextAuthHandler);
export const POST = hasNextAuthSecret
  ? nextAuthHandler
  : (errorHandler as typeof nextAuthHandler);
