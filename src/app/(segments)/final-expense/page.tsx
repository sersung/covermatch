import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getSegmentBySlug, getDimensionsByType, getPlansBySegment } from "@/lib/queries/segments"

export const metadata: Metadata = {
  title: `Best Final Expense Insurance (${new Date().getFullYear()}) — No Medical Exam Plans`,
  description:
    "Compare final expense and burial insurance plans. No medical exam options for seniors over 60, 70, and 80. See monthly premiums and guaranteed acceptance plans.",
}

export default async function FinalExpensePage() {
  const segment = await getSegmentBySlug("final-expense")
  if (!segment) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Final Expense Insurance</h1>
      <p className="text-gray-500 mt-3">Connect Supabase to load live plan data.</p>
    </div>
  )

  const [ageGroups, features] = await Promise.all([
    getDimensionsByType(segment.id, "age_group"),
    getDimensionsByType(segment.id, "feature"),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <nav className="text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Final Expense Insurance</span>
      </nav>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Best Final Expense Insurance ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Burial and final expense insurance designed for seniors — no medical exam required for most plans.
          Compare guaranteed acceptance policies and monthly premiums by age group.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-blue-100 text-blue-800">No Medical Exam Options</Badge>
          <Badge className="bg-green-100 text-green-800">Guaranteed Acceptance Plans</Badge>
          <Badge className="bg-purple-100 text-purple-800">Seniors 60–85+</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Age Group</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ageGroups.map((group) => {
            const meta = group.metadata as Record<string, unknown> | null
            return (
              <Link
                key={group.slug}
                href={`/final-expense/${group.slug}`}
                className="group rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 group-hover:text-blue-700">{group.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
                {meta?.avg_premium_usd && (
                  <div className="text-sm text-gray-500">Avg premium: <strong>${meta.avg_premium_usd as number}/mo</strong></div>
                )}
                {meta?.no_exam_available && (
                  <Badge className="mt-2 text-xs bg-green-100 text-green-700">No exam available</Badge>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Feature</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feat) => (
            <Link
              key={feat.slug}
              href={`/final-expense/${feat.slug}`}
              className="group rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 group-hover:text-blue-700">{feat.label}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="prose max-w-none">
        <h2>What is Final Expense Insurance?</h2>
        <p>
          Final expense insurance (also called burial insurance or funeral insurance) is a type of
          whole life insurance designed to cover end-of-life expenses including funeral costs, burial,
          and outstanding medical bills. Policies typically range from $5,000 to $25,000 in coverage.
        </p>
        <h2>Do You Need a Medical Exam?</h2>
        <p>
          Most final expense plans do <strong>not</strong> require a medical exam. Many offer
          guaranteed acceptance — meaning you cannot be denied coverage regardless of health status.
          These plans typically have a 2-year graded benefit period where full death benefits
          phase in gradually.
        </p>
      </div>
    </div>
  )
}
