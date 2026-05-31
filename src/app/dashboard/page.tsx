import { redirect } from "next/navigation"

const clerkConfigured =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("your_")
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Saved Quotes — Dashboard",
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })
}

export default async function DashboardPage() {
  if (!clerkConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">My Saved Quotes</h1>
        <p className="text-gray-500">Configure Clerk authentication in <code>.env.local</code> to enable quote saving.</p>
      </div>
    )
  }

  const { auth } = await import("@clerk/nextjs/server")
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const supabase = await createServerSupabaseClient()
  const { data: quotes } = await supabase
    .from("saved_quotes")
    .select("*, insurance_segments(name, slug, icon)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Saved Quotes</h1>
          <p className="text-gray-500 mt-1">Your saved insurance estimates and comparisons.</p>
        </div>
        <Link href="/pet-insurance">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> New Quote
          </Button>
        </Link>
      </div>

      {!quotes || quotes.length === 0 ? (
        <div className="text-center py-20 space-y-4 border rounded-xl bg-white">
          <FileText className="w-12 h-12 mx-auto text-gray-300" />
          <div>
            <p className="text-lg font-semibold text-gray-700">No saved quotes yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Use any of our calculators and save your estimate to see it here.
            </p>
          </div>
          <Link href="/pet-insurance">
            <Button className="mt-2">Start with Pet Insurance</Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {quotes.map((quote) => {
            const segment = quote.insurance_segments as { name: string; slug: string; icon: string } | null
            const inputData = quote.input_data as Record<string, unknown>

            return (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {segment?.icon && <span className="text-2xl">{segment.icon}</span>}
                      <div>
                        <CardTitle className="text-base">
                          {quote.label ?? segment?.name ?? "Insurance Quote"}
                        </CardTitle>
                        <p className="text-xs text-gray-400">{formatDate(quote.created_at)}</p>
                      </div>
                    </div>
                    <Badge variant={quote.is_paid ? "default" : "secondary"}>
                      {quote.is_paid ? "Premium ★" : "Free"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-1">
                    {inputData.petAge && <div>Pet age: <strong>{inputData.petAge as string} yrs</strong></div>}
                    {inputData.state && <div>State: <strong>{inputData.state as string}</strong></div>}
                    {inputData.annualVetCost && (
                      <div>Annual vet cost: <strong>${(inputData.annualVetCost as number).toLocaleString()}</strong></div>
                    )}
                    {inputData.dimensionSlug && (
                      <div>Condition: <strong>{inputData.dimensionSlug as string}</strong></div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {segment && (
                      <Link href={`/${segment.slug}`}>
                        <Button variant="outline" size="sm">View Segment</Button>
                      </Link>
                    )}
                    {quote.is_paid ? (
                      <Link href={`/dashboard/report/${quote.id}`}>
                        <Button size="sm">
                          <Star className="w-3 h-3 mr-1" /> View Report
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/checkout/${quote.id}`}>
                        <Button size="sm" variant="outline">
                          Get Full Report — $9.99
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
