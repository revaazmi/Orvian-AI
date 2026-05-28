import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authPaths = ["/login", "/register"]

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  const sessionToken =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value
  const isLoggedIn = !!sessionToken

  if (isLoggedIn && authPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  if (
    !isLoggedIn &&
    !authPaths.some((p) => pathname.startsWith(p)) &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
