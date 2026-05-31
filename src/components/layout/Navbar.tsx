"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import dynamic from "next/dynamic"

const segments = [
  { label: "Pet", href: "/pet-insurance" },
  { label: "Final Expense", href: "/final-expense" },
  { label: "Life", href: "/life-insurance" },
  { label: "Travel", href: "/travel-insurance" },
  { label: "Landlord", href: "/landlord-insurance" },
]

const clerkReady =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "string" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 10 &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("your_")

const ClerkNavAuth = dynamic(() => import("@/components/layout/ClerkNavAuth"), { ssr: false })

function StaticNavAuth() {
  return (
    <>
      <Link href="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
      <Link href="/sign-up"><Button size="sm">Get Started</Button></Link>
    </>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
          <Shield className="w-6 h-6" />
          CoverMatch
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {segments.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {clerkReady ? <ClerkNavAuth /> : <StaticNavAuth />}
        </div>
      </div>
    </header>
  )
}
