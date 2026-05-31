import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSegmentBySlug, getDimensionBySlug, getSegmentDimensions, getPlansBySegment } from "@/lib/queries/segments"

type Props = { params: Promise<{ dimension: string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("final-expense")
  if (!seg) return []
  const dims = await getSegmentDimensions(seg.id)
  return dims.map((d) => ({ dimension: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dimension: dimSlug } = await params
  const segment = await getSegmentBySlug("final-expense")
  if (!segment) return {}
  const dim = await getDimensionBySlug(segment.id, dimSlug)
  if (!dim) return {}
  return {
    title: `${dim.label} — Final Expense Insurance (${new Date().getFullYear()})`,
    description: `Compare final expense insurance for ${dim.label.toLowerCase()}. No medical exam options available. See guaranteed acceptance plans and monthly premiums.`,
  }
}

export default async function FinalExpenseDimensionPage({ params }: Props) {
  const { dimension: dimSlug } = await params
  const segment = await getSegmentBySlug("final-expense")
  if (!segment) return notFound()

  const dim = await getDimensionBySlug(segment.id, dimSlug)
  if (!dim) return notFound()

  const meta = dim.metadata as Record<string, unknown> | null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <nav className="text-sm text-gray-500 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/final-expense" className="hover:text-blue-600">Final Expense Insurance</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{dim.label}</span>
      </nav>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {dim.label} — Final Expense Insurance ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Find the best burial and final expense insurance for {dim.label.toLowerCase()}.
          Compare monthly premiums, guaranteed acceptance options, and coverage amounts.
        </p>

        {!!meta?.avg_premium_usd && (
          <div className="rounded-xl border bg-blue-50 p-6 grid sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">${meta.avg_premium_usd as number}/mo</div>
              <div className="text-sm text-gray-600">Average premium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {meta.typical_benefit_usd ? `$${(meta.typical_benefit_usd as number).toLocaleString()}` : "$10–25k"}
              </div>
              <div className="text-sm text-gray-600">Typical coverage amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{meta.no_exam_available ? "Yes" : "Check eligibility"}</div>
              <div className="text-sm text-gray-600">No-exam options available</div>
            </div>
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <h2>Final Expense Insurance for {dim.label}</h2>
        <p>
          Final expense insurance for {dim.label.toLowerCase()} typically offers coverage between
          $5,000 and $25,000, with premiums locked in for life (no rate increases). Most plans
          available at this age group are{" "}
          {meta?.no_exam_available ? "available without a medical exam" : "simplified issue policies"}.
        </p>
        <h2>How to Choose the Right Plan</h2>
        <ul>
          <li><strong>Coverage amount:</strong> Calculate expected funeral costs ($8,000–$12,000 average) plus any outstanding debts.</li>
          <li><strong>Graded vs. level benefit:</strong> Guaranteed acceptance plans often have a 2-year graded period. Level benefit plans pay immediately.</li>
          <li><strong>Premium lock:</strong> Ensure premiums are fixed for life — not subject to annual increases.</li>
          <li><strong>Company ratings:</strong> Choose AM Best A-rated or better carriers.</li>
        </ul>
      </div>

      <Link href="/final-expense" className="inline-flex items-center text-blue-600 hover:underline text-sm">
        ← Back to Final Expense Hub
      </Link>
    </div>
  )
}
