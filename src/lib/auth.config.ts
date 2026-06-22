import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  providers: [Google],
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/api/quotes")
      if (isProtected && !isLoggedIn) return false
      return true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session({ session, token }: { session: any; token: any }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt({ token, user }: { token: any; user: any }) {
      if (user?.id) token.sub = user.id
      return token
    },
  },
} satisfies NextAuthConfig
