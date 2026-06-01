import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSegmentBySlug, getDimensionsByType } from "@/lib/queries/segments"

export const metadata: Metadata = {
  title: `Life Insurance for High-Risk Conditions (${new Date().getFullYear()})`,
  description: "Compare life insurance for diabetics, smokers, heart disease survivors, and high-risk occupations. Find affordable term and whole life coverage.",
}

export default async function LifeInsurancePage() {
  const segment = await getSegmentBySlug("life-insurance")
  if (!segment) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Life Insurance</h1>
      <p className="text-gray-500 mt-3">Connect Supabase to load live plan data.</p>
    </div>
  )
  const conditions = await getDimensionsByType(segment.id, "condition")

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <nav className="text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Life Insurance</span>
      </nav>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Life Insurance for High-Risk Conditions ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Having a health condition doesn't mean you can't get life insurance — it means you need
          to shop smarter. Compare options for diabetics, smokers, and other high-risk applicants.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Condition</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {conditions.map((cond) => (
            <Link
              key={cond.slug}
              href={`/life-insurance/${cond.slug}`}
              className="group rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-blue-700">{cond.label}</div>
                {!!(cond.metadata as Record<string, unknown> | null)?.notes && (
                  <div className="text-sm text-gray-500 mt-1">{((cond.metadata as Record<string, unknown>).notes) as string}</div>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="prose max-w-none">
        <h2>Can You Get Life Insurance with a Health Condition?</h2>
        <p>
          Yes — but the process and premiums differ significantly. Underwriters assess your
          specific condition, how well it's managed, your age, and other risk factors. The key is
          working with carriers that specialize in high-risk life insurance.
        </p>
        <h2>Term vs. Whole Life for High-Risk Applicants</h2>
        <p>
          Term life is usually more affordable even for high-risk applicants. Whole life builds
          cash value but premiums can be 5–10x higher. For most high-risk applicants, a 20-year
          term policy is the most cost-effective option.
        </p>
      </div>
    </div>
  )
}
