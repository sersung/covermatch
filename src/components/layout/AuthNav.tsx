"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export default function AuthNav() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  if (isPending) return null

  if (session) {
    return (
      <>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">My Quotes</Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign Out
        </Button>
      </>
    )
  }

  return (
    <>
      <Link href="/sign-in">
        <Button variant="ghost" size="sm">Sign In</Button>
      </Link>
      <Link href="/sign-up">
        <Button size="sm">Get Started</Button>
      </Link>
    </>
  )
}
