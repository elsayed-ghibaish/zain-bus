// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.pathname;

  // Protect /dashboard routes for administrators only
  if (url.startsWith("/dashboard")) {
    if (!token || token.role_sign !== "administrator") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /profile route for any logged-in user
  if (url.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
