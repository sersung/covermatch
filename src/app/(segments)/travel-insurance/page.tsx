import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getSegmentBySlug, getDimensionsByType } from "@/lib/queries/segments"

export const metadata: Metadata = {
  title: `Best Travel Insurance by Visa Type (${new Date().getFullYear()})`,
  description: "Compare travel insurance plans for Schengen visas, UK visas, and international travel. Find visa-compliant coverage with $30,000+ medical coverage.",
}

export default async function TravelInsurancePage() {
  const segment = await getSegmentBySlug("travel-insurance")
  if (!segment) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Travel Insurance</h1>
      <p className="text-gray-500 mt-3">Connect Supabase to load live plan data.</p>
    </div>
  )

  const [visaTypes, destinations] = await Promise.all([
    getDimensionsByType(segment.id, "visa_type"),
    getDimensionsByType(segment.id, "destination"),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <nav className="text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Travel Insurance</span>
      </nav>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Travel Insurance by Visa Type ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Not all travel insurance meets visa requirements. Find plans that are Schengen-compliant,
          include minimum coverage amounts, and cover medical evacuation.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-blue-100 text-blue-800">Schengen Compliant</Badge>
          <Badge className="bg-green-100 text-green-800">€30,000+ Medical</Badge>
          <Badge className="bg-purple-100 text-purple-800">Cancel For Any Reason</Badge>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Visa Type</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {visaTypes.map((visa) => {
            const meta = visa.metadata as Record<string, unknown> | null
            return (
              <Link
                key={visa.slug}
                href={`/travel-insurance/${visa.slug}`}
                className="group rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900 group-hover:text-blue-700">{visa.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
                {!!meta?.required && (
                  <Badge className="text-xs bg-red-100 text-red-700">Insurance Required</Badge>
                )}
                {!!meta?.min_coverage_eur && (
                  <div className="text-sm text-gray-500 mt-1">Min: €{(meta.min_coverage_eur as number).toLocaleString()} coverage</div>
                )}
                {!!meta?.notes && <div className="text-xs text-gray-400 mt-1">{meta.notes as string}</div>}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="prose max-w-none">
        <h2>Do You Need Travel Insurance for a Schengen Visa?</h2>
        <p>
          Yes — travel insurance is <strong>mandatory</strong> for a Schengen visa application.
          The policy must cover at least <strong>€30,000</strong> in medical expenses and be valid
          for all 27 Schengen Area countries for the entire duration of your stay.
        </p>
        <h2>What Does Travel Insurance Cover?</h2>
        <p>
          Standard travel insurance covers medical emergencies, trip cancellation, baggage loss,
          and emergency evacuation. Premium policies add "cancel for any reason" coverage,
          adventure sports, and pre-existing condition waivers.
        </p>
      </div>
    </div>
  )
}
