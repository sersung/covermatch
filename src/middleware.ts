import { NextRequest, NextResponse } from "next/server"

const protectedPaths = ["/dashboard", "/api/quotes"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (!isProtected) return NextResponse.next()

  // Lightweight check: presence of session cookie.
  // Full validation (expiry, revocation) happens inside each route/page.
  const sessionCookie =
    req.cookies.get("better-auth.session_token") ??
    req.cookies.get("__Secure-better-auth.session_token")

  if (!sessionCookie) {
    const signIn = new URL("/sign-in", req.url)
    signIn.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signIn)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
