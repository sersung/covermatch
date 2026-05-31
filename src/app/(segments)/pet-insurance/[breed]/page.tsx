import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { InsuranceCalculator } from "@/components/insurance/InsuranceCalculator"
import { ComparisonTable, PlanProsCons } from "@/components/insurance/ComparisonTable"
import {
  getSegmentBySlug,
  getDimensionBySlug,
  getDimensionsByType,
  getPlansBySegment,
} from "@/lib/queries/segments"

type Props = { params: Promise<{ breed: string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("pet-insurance")
  if (!seg) return []
  const breeds = await getDimensionsByType(seg.id, "breed")
  return breeds.map((b) => ({ breed: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { breed: breedSlug } = await params
  const segment = await getSegmentBySlug("pet-insurance")
  if (!segment) return {}
  const breed = await getDimensionBySlug(segment.id, breedSlug)
  if (!breed) return {}

  const year = new Date().getFullYear()
  return {
    title: `Best Pet Insurance for ${breed.label} (${year} Guide)`,
    description: `Compare pet insurance plans for ${breed.label}. See which plans cover hereditary conditions, monthly premiums, and waiting periods. Free premium calculator.`,
  }
}

export default async function BreedPage({ params }: Props) {
  const { breed: breedSlug } = await params
  const segment = await getSegmentBySlug("pet-insurance")
  if (!segment) return notFound()

  const [breed, plans, conditions] = await Promise.all([
    getDimensionBySlug(segment.id, breedSlug),
    getPlansBySegment(segment.id),
    getDimensionsByType(segment.id, "condition"),
  ])
  if (!breed) return notFound()

  const meta = breed.metadata as Record<string, unknown> | null
  const avgVetCost = (meta?.avg_annual_vet_usd as number) ?? 2500
  const riskTier = (meta?.risk_tier as string) ?? "medium"
  const brachycephalic = Boolean(meta?.brachycephalic)

  const year = new Date().getFullYear()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How much does pet insurance cost for a ${breed.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Pet insurance for ${breed.label} typically costs between $40–$80/month, depending on age, location, and coverage. High-risk breeds like ${brachycephalic ? "brachycephalic dogs " : ""}may cost more.`,
        },
      },
      {
        "@type": "Question",
        name: `Does pet insurance cover hereditary conditions for ${breed.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, most pet insurance providers cover hereditary conditions for ${breed.label} if the pet is enrolled before symptoms appear. Some conditions like hip dysplasia may incur a surcharge.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/pet-insurance" className="hover:text-blue-600">Pet Insurance</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{breed.label}</span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Best Pet Insurance for {breed.label} ({year})
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            {breed.label} owners face unique health risks and vet costs. We compared{" "}
            {plans.length} pet insurance plans to find the best coverage for your{" "}
            {breed.label.toLowerCase()}.
          </p>

          {/* Stat Block */}
          <div className="grid sm:grid-cols-3 gap-4 rounded-xl border bg-blue-50 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">${avgVetCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg annual vet cost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700 capitalize">{riskTier}</div>
              <div className="text-sm text-gray-600">Risk tier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                ★ {plans[0]?.rating?.toFixed(1) ?? "4.5"}
              </div>
              <div className="text-sm text-gray-600">Top plan rating ({plans[0] && "providers" in plans[0] ? (plans[0] as any).providers.name : ""})</div>
            </div>
          </div>

          {brachycephalic && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
              ⚠️ <strong>{breed.label}</strong> is a brachycephalic breed. Expect a 15–20% premium surcharge from most insurers due to elevated respiratory health risks.
            </div>
          )}
        </div>

        {/* Calculator */}
        <InsuranceCalculator
          plans={plans as Parameters<typeof InsuranceCalculator>[0]["plans"]}
          segmentSlug="pet-insurance"
          segmentId={segment.id}
        />

        {/* Comparison Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Plans Available for {breed.label}
          </h2>
          <ComparisonTable plans={plans as Parameters<typeof ComparisonTable>[0]["plans"]} />
        </div>

        {/* Browse by Condition */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {breed.label} Insurance by Health Condition
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            See which plans cover specific health conditions common in {breed.label.toLowerCase()}s.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {conditions.map((cond) => (
              <Link
                key={cond.slug}
                href={`/pet-insurance/${breedSlug}/${cond.slug}`}
                className="group flex items-center justify-between rounded-lg border bg-white px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-sm text-gray-800 group-hover:text-blue-700">
                  {cond.label}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose max-w-none">
          <h2>What to Look For in {breed.label} Insurance</h2>
          <p>
            When shopping for pet insurance for your {breed.label.toLowerCase()}, the most important
            factors are whether the plan covers{" "}
            {brachycephalic ? "brachycephalic syndrome and " : ""}
            hereditary conditions before they become symptomatic, the reimbursement rate (80–90% is
            best), and whether there is an annual coverage limit.
          </p>
          <p>
            The average annual vet cost for {breed.label.toLowerCase()}s is{" "}
            <strong>${avgVetCost.toLocaleString()}</strong> — significantly higher than average.
            A plan with at least 80% reimbursement can save you thousands per year.
          </p>
          <h2>When to Enroll Your {breed.label}</h2>
          <p>
            Enroll as early as possible — ideally when your {breed.label.toLowerCase()} is a puppy.
            Waiting periods (typically 14 days for illness, 6 months for orthopedic conditions)
            mean any condition diagnosed before or during the waiting period will be excluded.
          </p>
        </div>
      </div>
    </>
  )
}
