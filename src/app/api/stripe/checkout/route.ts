import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-03-31.basil" })

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { quoteId } = await req.json()
  if (!quoteId) return NextResponse.json({ error: "Missing quoteId" }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_REPORT_PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard/report/${quoteId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/dashboard/checkout/${quoteId}`,
    metadata: {
      quoteId,
      userId,
    },
  })

  return NextResponse.json({ url: session.url })
}
