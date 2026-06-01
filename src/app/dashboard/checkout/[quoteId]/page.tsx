import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, FileText, Star } from "lucide-react"

type Props = { params: Promise<{ quoteId: string }> }

export default async function CheckoutPage({ params }: Props) {
  const { quoteId } = await params
  const { auth } = await import("@clerk/nextjs/server")
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  type QuoteRow = { is_paid: boolean; insurance_segments: { name: string; icon: string } | null }
  const supabase = await createServerSupabaseClient()
  const { data: quote } = await supabase
    .from("saved_quotes")
    .select("*, insurance_segments(name, icon)")
    .eq("id", quoteId)
    .eq("user_id", userId)
    .single() as { data: QuoteRow | null }

  if (!quote) redirect("/dashboard")
  if (quote.is_paid) redirect(`/dashboard/report/${quoteId}`)

  const segment = quote.insurance_segments

  const perks = [
    "Side-by-side PDF comparison of all plans",
    "Personalized recommendation based on your inputs",
    "Cost breakdown over 1, 3, and 5 years",
    "Affiliate links to apply directly to each provider",
    "Saved forever in your dashboard",
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="text-5xl">{segment?.icon ?? "📊"}</div>
        <h1 className="text-3xl font-bold text-gray-900">Unlock Your Full Report</h1>
        <p className="text-gray-500">
          Get a personalized PDF comparison report for your {segment?.name ?? "insurance"} quote.
        </p>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Premium Report</CardTitle>
            <Badge className="text-lg px-4 py-1 bg-blue-600">$9.99</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {perks.map((perk) => (
            <div key={perk} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>{perk}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <StripeCheckoutButton quoteId={quoteId} />

      <p className="text-center text-xs text-gray-400">
        Secure payment via Stripe. One-time purchase. No subscription.
      </p>
    </div>
  )
}
