import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSegmentBySlug, getDimensionBySlug, getDimensionsByType } from "@/lib/queries/segments"

type Props = { params: Promise<{ "visa-type": string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("travel-insurance")
  if (!seg) return []
  const dims = await getDimensionsByType(seg.id, "visa_type")
  return dims.map((d) => ({ "visa-type": d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params)["visa-type"]
  const segment = await getSegmentBySlug("travel-insurance")
  if (!segment) return {}
  const dim = await getDimensionBySlug(segment.id, slug)
  if (!dim) return {}
  return {
    title: `Best Travel Insurance for ${dim.label} (${new Date().getFullYear()})`,
    description: `Compare travel insurance plans that meet ${dim.label} requirements. Visa-compliant coverage with medical, cancellation, and evacuation protection.`,
  }
}

export default async function TravelVisaPage({ params }: Props) {
  const visaSlug = (await params)["visa-type"]
  const segment = await getSegmentBySlug("travel-insurance")
  if (!segment) return notFound()

  const dim = await getDimensionBySlug(segment.id, visaSlug)
  if (!dim) return notFound()

  const meta = dim.metadata as Record<string, unknown> | null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <nav className="text-sm text-gray-500 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/travel-insurance" className="hover:text-blue-600">Travel Insurance</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{dim.label}</span>
      </nav>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Best Travel Insurance for {dim.label} ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          {meta?.notes as string ?? `Find the best travel insurance plans for ${dim.label.toLowerCase()} travelers.`}
        </p>

        {!!meta?.min_coverage_eur && (
          <div className="rounded-xl border bg-blue-50 p-6 grid sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">€{(meta.min_coverage_eur as number).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Minimum medical coverage required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{(meta.valid_countries as string | number) ?? "—"}</div>
              <div className="text-sm text-gray-600">Countries covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{meta.required ? "Required" : "Recommended"}</div>
              <div className="text-sm text-gray-600">Insurance status</div>
            </div>
          </div>
        )}
      </div>

      <div className="prose max-w-none">
        <h2>Requirements for {dim.label} Travel Insurance</h2>
        {visaSlug === "schengen-visa" ? (
          <>
            <p>
              For a Schengen visa, your travel insurance must meet strict EU requirements:
            </p>
            <ul>
              <li>Minimum coverage of <strong>€30,000</strong> for medical expenses</li>
              <li>Must cover <strong>all 27 Schengen countries</strong></li>
              <li>Valid for the <strong>entire duration</strong> of your stay</li>
              <li>Must cover <strong>medical repatriation and emergency evacuation</strong></li>
            </ul>
            <p>
              Recommended providers for Schengen visa insurance include AXA Schengen, Allianz,
              and World Nomads — all of which issue visa-accepted documentation.
            </p>
          </>
        ) : (
          <p>
            Compare travel insurance plans that meet the requirements for {dim.label.toLowerCase()}{" "}
            travelers. Look for plans that include medical coverage, trip cancellation, and
            emergency evacuation.
          </p>
        )}
      </div>

      <Link href="/travel-insurance" className="inline-flex items-center text-blue-600 hover:underline text-sm">
        ← Back to Travel Insurance Hub
      </Link>
    </div>
  )
}
