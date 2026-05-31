"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"

export function StripeCheckoutButton({ quoteId }: { quoteId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      className="w-full text-base py-6"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Lock className="w-4 h-4 mr-2" />
      )}
      {loading ? "Redirecting to Stripe…" : "Pay $9.99 — Get Full Report"}
    </Button>
  )
}
