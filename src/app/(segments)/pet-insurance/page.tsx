import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InsuranceCalculator } from "@/components/insurance/InsuranceCalculator"
import { ComparisonTable } from "@/components/insurance/ComparisonTable"
import { getSegmentBySlug, getPlansBySegment, getDimensionsByType } from "@/lib/queries/segments"

export const metadata: Metadata = {
  title: `Best Pet Insurance Plans (${new Date().getFullYear()} Guide)`,
  description:
    "Compare pet insurance plans for dogs and cats. See monthly premiums, reimbursement rates, and which plans cover hereditary conditions. Free calculator included.",
}

export default async function PetInsurancePage() {
  const segment = await getSegmentBySlug("pet-insurance")
  if (!segment) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Pet Insurance Hub</h1>
      <p className="text-gray-500">Connect Supabase to load live plan data. See <code>.env.local</code> for setup instructions.</p>
    </div>
  )

  const [plans, breeds, conditions] = await Promise.all([
    getPlansBySegment(segment.id),
    getDimensionsByType(segment.id, "breed"),
    getDimensionsByType(segment.id, "condition"),
  ])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does pet insurance cost per month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pet insurance typically costs $25–$80/month for dogs and $10–$40/month for cats, depending on breed, age, location, and coverage level.",
        },
      },
      {
        "@type": "Question",
        name: "Does pet insurance cover pre-existing conditions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most pet insurance plans do not cover pre-existing conditions. However, some providers like Spot and Embrace cover curable pre-existing conditions after a waiting period.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Pet Insurance</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* Hero */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Best Pet Insurance Plans ({new Date().getFullYear()})
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Compare top pet insurance providers for dogs and cats. Filter by breed, pre-existing
            conditions, or coverage type. Use our free calculator to estimate your monthly premium.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">7 Providers Compared</Badge>
            <Badge className="bg-green-100 text-green-800">12 Breeds Covered</Badge>
            <Badge className="bg-purple-100 text-purple-800">8 Conditions Analyzed</Badge>
          </div>
        </div>

        {/* Calculator */}
        <InsuranceCalculator
          plans={plans as Parameters<typeof InsuranceCalculator>[0]["plans"]}
          segmentSlug="pet-insurance"
          segmentId={segment.id}
        />

        {/* Comparison Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Pet Insurance Plans</h2>
          <ComparisonTable plans={plans as Parameters<typeof ComparisonTable>[0]["plans"]} />
        </div>

        {/* Browse by Breed */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Breed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {breeds.map((breed) => (
              <Link
                key={breed.slug}
                href={`/pet-insurance/${breed.slug}`}
                className="group flex items-center justify-between rounded-lg border bg-white px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="font-medium text-sm text-gray-800 group-hover:text-blue-700">
                  {breed.label}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </Link>
            ))}
          </div>
        </div>

        {/* Browse by Condition */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Pre-Existing Condition</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {conditions.map((cond) => (
              <Link
                key={cond.slug}
                href={`/pet-insurance/french-bulldog/${cond.slug}`}
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

        {/* FAQ */}
        <div className="prose max-w-none">
          <h2>Frequently Asked Questions</h2>
          <h3>Does pet insurance cover pre-existing conditions?</h3>
          <p>
            Most standard pet insurance policies exclude pre-existing conditions — meaning illnesses or
            injuries that existed before the policy start date. However, some providers like{" "}
            <strong>Spot Pet Insurance</strong> and <strong>Embrace</strong> cover{" "}
            <em>curable</em> pre-existing conditions after a waiting period (typically 6–12 months
            symptom-free). Chronic conditions like diabetes or allergies are almost always excluded.
          </p>
          <h3>What affects pet insurance premiums?</h3>
          <p>
            Key factors include your pet's breed (high-risk breeds like French Bulldogs cost more),
            age (older pets pay significantly more), your US state (California and New York are the
            most expensive), and the coverage level you choose (deductible, reimbursement rate, and
            coverage limit).
          </p>
        </div>
      </div>
    </>
  )
}
