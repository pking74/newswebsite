import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const adminEnabled = process.env.ADMIN_ENABLED === "true";

  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname.startsWith("/admin/login");
  const isLoginApi = pathname.startsWith("/api/admin/login");

  if (!isAdminPath && !isAdminApi) {
    return NextResponse.next();
  }

  // If admin features are disabled, just let the existing route handlers
  // handle it (they already check ADMIN_ENABLED in APIs). We can also short-circuit:
  if (!adminEnabled) {
    // Optional: redirect to home instead of showing login when disabled
    return NextResponse.next();
  }

  // Allow login routes through without cookie
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const adminCookie = req.cookies.get(COOKIE_NAME);

  // If no valid admin cookie, force login
  if (!adminCookie || adminCookie.value !== "ok") {
    if (isAdminApi) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized (admin login required)" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Run this middleware only on admin-related paths
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
