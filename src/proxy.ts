import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkConfigured = !!clerkPublishableKey && !clerkPublishableKey.startsWith("your_")

// Lazy-load Clerk to prevent backend SDK initialization crash when keys are absent.
// The top-level import of @clerk/nextjs/server would initialize the Clerk backend
// at module evaluation time even if Clerk is not configured.
let clerkHandler: ((req: NextRequest) => Promise<NextResponse>) | null = null

async function buildClerkHandler() {
  const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server")
  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/quotes(.*)"])
  return clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect()
    }
  }) as (req: NextRequest) => Promise<NextResponse>
}

export async function proxy(req: NextRequest) {
  if (!clerkConfigured) return NextResponse.next()
  if (!clerkHandler) clerkHandler = await buildClerkHandler()
  return clerkHandler(req)
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
