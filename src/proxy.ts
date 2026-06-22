import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

// Next.js 16: named export "proxy" instead of default "middleware"
export const { auth: proxy } = NextAuth(authConfig)

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
