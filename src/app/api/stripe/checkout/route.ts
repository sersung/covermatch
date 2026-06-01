import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
  apiVersion: "2026-05-27.dahlia",
})

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { quoteId } = (await req.json()) as { quoteId?: string }
  if (!quoteId) return NextResponse.json({ error: "Missing quoteId" }, { status: 400 })

  // Verify the quote belongs to this user before charging
  const quote = await prisma.savedQuote.findFirst({
    where: { id: quoteId, userId: session.user.id },
  })
  if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002"

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PREMIUM_REPORT_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard/report/${quoteId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/checkout/${quoteId}`,
    metadata: { quoteId, userId: session.user.id },
  })

  return NextResponse.json({ url: stripeSession.url })
}
