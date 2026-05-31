"use client"

import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function ClerkNavAuth() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">My Quotes</Button>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </>
    )
  }

  return (
    <>
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">Sign In</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button size="sm">Get Started</Button>
      </SignUpButton>
    </>
  )
}
