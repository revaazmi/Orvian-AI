import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const publicPaths = ["/login", "/register"]
  const isPublic = publicPaths.some((p) => pathname.startsWith(p))
  const isApiAuth = pathname.startsWith("/api/auth") || pathname.startsWith("/api/register")

  if (isApiAuth) {
    return NextResponse.next()
  }

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  if (!isLoggedIn && !isPublic && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (!isLoggedIn && pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
