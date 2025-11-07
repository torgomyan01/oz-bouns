import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { SITE_URL } from "@/utils/consts";
import * as UAParser from "ua-parser-js"; // Corrected import

// Check if NEXTAUTH_SECRET is available
const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;

// Simple middleware function that bypasses NextAuth if secret is missing
function simpleMiddleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Allow all requests if NextAuth is not configured
  // This prevents infinite redirect loops
  return NextResponse.next();
}

// NextAuth middleware function
const nextAuthMiddleware = withAuth(
  function middleware(request: NextRequest & { nextauth?: { token: any } }) {
    const url = request.nextUrl.pathname;
    const token = (request as any).nextauth?.token;

    // Եթե օգտատերը մուտք է գործել և գալիս է գլխավոր էջ, ուղղորդել user-profile
    if (url === SITE_URL.HOME && token) {
      return NextResponse.redirect(new URL(SITE_URL.USER_PROFILE, request.url));
    }

    // Եթե օգտատերը մուտք չի գործել և գալիս է user-profile, թողնել գլխավոր էջում
    if (url === SITE_URL.USER_PROFILE && !token) {
      return NextResponse.redirect(new URL(SITE_URL.HOME, request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const url = req.nextUrl.pathname;

        // Գլխավոր էջը հասանելի է բոլորի համար
        if (url === SITE_URL.HOME) {
          return true;
        }

        // User profile-ը պահանջում է մուտք
        if (url === SITE_URL.USER_PROFILE) {
          return !!token;
        }

        return true;
      },
    },
  },
);

// Export the appropriate middleware based on NEXTAUTH_SECRET availability
// This prevents infinite redirect loops when NEXTAUTH_SECRET is missing
const middleware = hasNextAuthSecret ? nextAuthMiddleware : simpleMiddleware;

export default middleware;

export const config = {
  matcher: [SITE_URL.USER_PROFILE, SITE_URL.HOME],
};
