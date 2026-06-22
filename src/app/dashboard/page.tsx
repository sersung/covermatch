import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Star } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Saved Quotes — Dashboard",
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const quotes = await prisma.savedQuote.findMany({
    where: { userId: session.user.id },
    include: { segment: { select: { name: true, slug: true, icon: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Saved Quotes</h1>
          <p className="text-gray-500 mt-1">Your saved insurance estimates and comparisons.</p>
        </div>
        <Link href="/pet-insurance">
          <Button><Plus className="w-4 h-4 mr-2" /> New Quote</Button>
        </Link>
      </div>

      {quotes.length === 0 ? (
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
            const inputData = quote.inputData as Record<string, unknown>
            return (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {quote.segment?.icon && <span className="text-2xl">{quote.segment.icon}</span>}
                      <div>
                        <CardTitle className="text-base">
                          {quote.label ?? quote.segment?.name ?? "Insurance Quote"}
                        </CardTitle>
                        <p className="text-xs text-gray-400">{formatDate(quote.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant={quote.isPaid ? "default" : "secondary"}>
                      {quote.isPaid ? "Premium ★" : "Free"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 space-y-1">
                    {!!inputData.petAge && <div>Pet age: <strong>{inputData.petAge as string} yrs</strong></div>}
                    {!!inputData.state && <div>State: <strong>{inputData.state as string}</strong></div>}
                    {!!inputData.annualVetCost && (
                      <div>Annual vet cost: <strong>${(inputData.annualVetCost as number).toLocaleString()}</strong></div>
                    )}
                    {!!inputData.dimensionSlug && (
                      <div>Condition: <strong>{inputData.dimensionSlug as string}</strong></div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {quote.segment && (
                      <Link href={`/${quote.segment.slug}`}>
                        <Button variant="outline" size="sm">View Segment</Button>
                      </Link>
                    )}
                    {quote.isPaid ? (
                      <Link href={`/dashboard/report/${quote.id}`}>
                        <Button size="sm">
                          <Star className="w-3 h-3 mr-1" /> View Report
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/dashboard/checkout/${quote.id}`}>
                        <Button size="sm" variant="outline">Get Full Report — $9.99</Button>
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
