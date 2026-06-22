import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/lib/auth"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "CoverMatch — Insurance Comparison for Every Situation",
    template: "%s | CoverMatch",
  },
  description:
    "Compare pet insurance, final expense, travel, life, and landlord insurance. Interactive calculators and side-by-side comparisons.",
  keywords: ["insurance comparison", "pet insurance", "final expense insurance", "travel insurance"],
  openGraph: {
    type: "website",
    siteName: "CoverMatch",
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
