import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Star } from "lucide-react"

type Props = { params: Promise<{ quoteId: string }> }

export default async function ReportPage({ params }: Props) {
  const { quoteId } = await params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const supabase = await createServerSupabaseClient()
  const { data: quote } = await supabase
    .from("saved_quotes")
    .select("*, insurance_segments(name, icon)")
    .eq("id", quoteId)
    .eq("user_id", userId)
    .single()

  if (!quote) redirect("/dashboard")
  if (!quote.is_paid) redirect(`/dashboard/checkout/${quoteId}`)

  const segment = quote.insurance_segments as { name: string; icon: string } | null
  const inputData = quote.input_data as Record<string, unknown>
  const results = quote.result_snapshot as Array<Record<string, unknown>> | null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{segment?.icon ?? "📊"}</span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Premium Insurance Report</h1>
            <Badge className="bg-yellow-500"><Star className="w-3 h-3 mr-1" />Premium</Badge>
          </div>
          <p className="text-gray-500">{segment?.name} — Personalized Comparison</p>
        </div>
      </div>

      {/* Inputs Summary */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Your Profile</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {inputData.petAge && (
            <div><div className="text-gray-400">Pet Age</div><div className="font-semibold">{inputData.petAge as string} years</div></div>
          )}
          {inputData.state && (
            <div><div className="text-gray-400">State</div><div className="font-semibold">{inputData.state as string}</div></div>
          )}
          {inputData.annualVetCost && (
            <div><div className="text-gray-400">Annual Vet Cost</div><div className="font-semibold">${(inputData.annualVetCost as number).toLocaleString()}</div></div>
          )}
          {inputData.dimensionSlug && (
            <div><div className="text-gray-400">Condition</div><div className="font-semibold capitalize">{(inputData.dimensionSlug as string).replace(/-/g, " ")}</div></div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && results.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Estimates</h2>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Card key={i} className={i === 0 ? "border-blue-300 bg-blue-50/50" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      {i === 0 && <Badge className="mb-1 bg-blue-600 text-xs">Top Pick</Badge>}
                      <div className="font-semibold text-gray-900">{r.planName as string}</div>
                      {r.coversCondition === true && (
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                          <CheckCircle2 className="w-3 h-3" /> Covers your condition
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">${r.monthly as string}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                      <div className="text-sm text-green-600">Net: ${r.netMonthly as string}/mo after reimbursement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5-Year Cost Analysis */}
      {results && results.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">5-Year Cost Analysis</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-gray-600">Plan</th>
                    <th className="text-right py-2 text-gray-600">1 Year</th>
                    <th className="text-right py-2 text-gray-600">3 Years</th>
                    <th className="text-right py-2 text-gray-600">5 Years</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const monthly = parseFloat(r.monthly as string)
                    return (
                      <tr key={i} className={`border-b last:border-0 ${i === 0 ? "bg-blue-50" : ""}`}>
                        <td className="py-2 font-medium">{r.planName as string}</td>
                        <td className="py-2 text-right">${(monthly * 12).toFixed(0)}</td>
                        <td className="py-2 text-right">${(monthly * 36).toFixed(0)}</td>
                        <td className="py-2 text-right">${(monthly * 60).toFixed(0)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-400 text-center">
        Estimates are for informational purposes only. Actual premiums may vary based on underwriting.
      </p>
    </div>
  )
}
