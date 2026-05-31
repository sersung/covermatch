import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { InsuranceCalculator } from "@/components/insurance/InsuranceCalculator"
import { ComparisonTable } from "@/components/insurance/ComparisonTable"
import {
  getSegmentBySlug,
  getDimensionBySlug,
  getDimensionsByType,
  getPlansBySegment,
} from "@/lib/queries/segments"

type Props = { params: Promise<{ breed: string; condition: string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("pet-insurance")
  if (!seg) return []
  const [breeds, conditions] = await Promise.all([
    getDimensionsByType(seg.id, "breed"),
    getDimensionsByType(seg.id, "condition"),
  ])
  const result: { breed: string; condition: string }[] = []
  for (const b of breeds) {
    for (const c of conditions) {
      result.push({ breed: b.slug, condition: c.slug })
    }
  }
  return result
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { breed: breedSlug, condition: conditionSlug } = await params
  const segment = await getSegmentBySlug("pet-insurance")
  if (!segment) return {}
  const [breed, condition] = await Promise.all([
    getDimensionBySlug(segment.id, breedSlug),
    getDimensionBySlug(segment.id, conditionSlug),
  ])
  if (!breed || !condition) return {}

  const year = new Date().getFullYear()
  return {
    title: `Best Pet Insurance for ${breed.label} with ${condition.label} (${year} Guide)`,
    description: `Compare pet insurance plans that cover ${condition.label} in ${breed.label}s. See monthly premiums, waiting periods, and which insurers actually pay claims. Free estimate tool.`,
  }
}

export default async function BreedConditionPage({ params }: Props) {
  const { breed: breedSlug, condition: conditionSlug } = await params
  const segment = await getSegmentBySlug("pet-insurance")
  if (!segment) return notFound()

  const [breed, condition, plans] = await Promise.all([
    getDimensionBySlug(segment.id, breedSlug),
    getDimensionBySlug(segment.id, conditionSlug),
    getPlansBySegment(segment.id),
  ])
  if (!breed || !condition) return notFound()

  const breedMeta = breed.metadata as Record<string, unknown> | null
  const condMeta = condition.metadata as Record<string, unknown> | null
  const avgVetCost = (breedMeta?.avg_annual_vet_usd as number) ?? 2500
  const avgCondCost = (condMeta?.avg_surgery_usd as number) ?? (condMeta?.avg_annual_cost_usd as number) ?? null

  // Count plans that cover this condition
  const coveringPlans = plans.filter((p) =>
    p.plan_coverage_rules.some(
      (r) => r.segment_dimensions.slug === conditionSlug && r.covers
    )
  )

  const year = new Date().getFullYear()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does pet insurance cover ${condition.label} for ${breed.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${coveringPlans.length} out of ${plans.length} pet insurance providers in our comparison cover ${condition.label} for ${breed.label}. Coverage depends on whether the condition was diagnosed before enrollment and whether it's considered hereditary or pre-existing.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the best pet insurance for ${breed.label} with ${condition.label}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on our analysis, ${coveringPlans[0] ? (coveringPlans[0] as any).providers?.name ?? coveringPlans[0].name : "Spot Pet Insurance"} offers the best coverage for ${breed.label}s with ${condition.label}, offering reimbursement rates up to ${coveringPlans[0]?.reimbursement_pct ?? 80}%.`,
        },
      },
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://covermatch.com" },
        { "@type": "ListItem", position: 2, name: "Pet Insurance", item: "https://covermatch.com/pet-insurance" },
        { "@type": "ListItem", position: 3, name: breed.label, item: `https://covermatch.com/pet-insurance/${breedSlug}` },
        { "@type": "ListItem", position: 4, name: condition.label },
      ],
    },
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
        <Link href={`/pet-insurance/${breedSlug}`} className="hover:text-blue-600">{breed.label}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{condition.label}</span>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* H1 + Stats */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Best Pet Insurance for {breed.label} with {condition.label} ({year} Guide)
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Not all pet insurance plans cover {condition.label.toLowerCase()} — and those that do
            may charge a surcharge for {breed.label.toLowerCase()}s. We analyzed every policy so
            you don't have to.
          </p>

          {/* Hero Stat Block */}
          <div className="grid sm:grid-cols-3 gap-4 rounded-xl border bg-blue-50 p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">${avgVetCost.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg annual vet cost ({breed.label})</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {coveringPlans.length}/{plans.length}
              </div>
              <div className="text-sm text-gray-600">Plans that cover {condition.label}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {avgCondCost ? `$${avgCondCost.toLocaleString()}` : "Varies"}
              </div>
              <div className="text-sm text-gray-600">
                {condMeta?.avg_surgery_usd ? "Avg surgery cost" : "Avg treatment cost"}
              </div>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Estimate Your Premium — {breed.label} with {condition.label}
          </h2>
          <InsuranceCalculator
            plans={plans as Parameters<typeof InsuranceCalculator>[0]["plans"]}
            segmentSlug="pet-insurance"
            dimensionSlug={conditionSlug}
            segmentId={segment.id}
          />
        </div>

        {/* Comparison Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plan Comparison — {condition.label} Coverage
          </h2>
          <ComparisonTable
            plans={plans as Parameters<typeof ComparisonTable>[0]["plans"]}
            filterDimensionSlug={conditionSlug}
          />
        </div>

        {/* SEO Content */}
        <div className="prose max-w-none">
          <h2>Does {condition.label} Count as a Pre-Existing Condition?</h2>
          <p>
            Whether {condition.label.toLowerCase()} counts as pre-existing depends on when your{" "}
            {breed.label.toLowerCase()} was diagnosed. If your vet noted any signs before your policy
            start date, most insurers will exclude it. The key is to enroll your pet{" "}
            <strong>before any symptoms appear</strong>.
          </p>

          <h2>What to Look For When Insuring a {breed.label} with {condition.label}</h2>
          <ul>
            <li>
              <strong>Hereditary condition coverage:</strong> Look for plans that explicitly state
              hereditary and congenital conditions are covered (not just accidents and illnesses).
            </li>
            <li>
              <strong>Waiting periods:</strong> Orthopedic conditions typically have longer waiting
              periods (6 months vs. 14 days for general illness). Enroll early.
            </li>
            <li>
              <strong>Coverage limits:</strong> Prefer plans with unlimited annual coverage or at
              least $15,000+ if treating {condition.label.toLowerCase()} could require surgery.
            </li>
            <li>
              <strong>Reimbursement rate:</strong> 80–90% reimbursement is optimal for high-cost
              conditions. A lower rate means more out-of-pocket expenses.
            </li>
          </ul>

          <h2>Internal Comparisons</h2>
        </div>

        {/* Internal Links */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href={`/pet-insurance/${breedSlug}`}
            className="rounded-lg border bg-white p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-blue-700">← All {breed.label} Insurance Plans</div>
            <div className="text-sm text-gray-500 mt-1">See all plans without condition filter</div>
          </Link>
          <Link
            href="/pet-insurance"
            className="rounded-lg border bg-white p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="font-semibold text-blue-700">← Pet Insurance Hub</div>
            <div className="text-sm text-gray-500 mt-1">Browse all breeds and conditions</div>
          </Link>
        </div>
      </div>
    </>
  )
}
