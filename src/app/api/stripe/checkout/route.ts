import { NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { quoteId } = await req.json()
  if (!quoteId) return NextResponse.json({ error: "Missing quoteId" }, { status: 400 })

  const origin = req.headers.get("origin") ?? "http://localhost:3002"

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PREMIUM_REPORT_PRICE_ID!, quantity: 1 }],
    metadata: { quoteId, userId: session.user.id },
    success_url: `${origin}/dashboard/report/${quoteId}?success=1`,
    cancel_url: `${origin}/dashboard/checkout/${quoteId}?cancelled=1`,
  })

  return NextResponse.json({ url: checkout.url })
}
