import { NextResponse, NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // If user has token and is trying to access auth pages → redirect to dashboard
  if (
    token &&
    (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If no token and trying to access auth pages → allow access (don't redirect)
  if (
    !token &&
    (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.next();
  }

  // If no token and accessing protected routes → redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // If token exists and accessing protected routes → allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/projects/:path*",
    "/dashboard/:path*",
    "/account/:path*",
    "/auth/signin",
    "/auth/signup",
  ],
};
