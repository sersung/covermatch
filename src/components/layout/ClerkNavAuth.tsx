"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

type Props = { fallback?: React.ReactNode }

export default function AuthNav({ fallback }: Props) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return fallback ?? null
  }

  if (session?.user) {
    return (
      <>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-1" />
            My Quotes
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-1" />
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
