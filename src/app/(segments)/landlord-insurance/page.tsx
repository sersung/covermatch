import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getSegmentBySlug, getDimensionsByType } from "@/lib/queries/segments"

export const metadata: Metadata = {
  title: `Best Landlord Insurance by Property Type (${new Date().getFullYear()})`,
  description: "Compare landlord insurance for short-term rentals (Airbnb), multi-family properties, and vacation homes. Find coverage that protects your rental income.",
}

export default async function LandlordInsurancePage() {
  const segment = await getSegmentBySlug("landlord-insurance")
  if (!segment) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Landlord Insurance</h1>
      <p className="text-gray-500 mt-3">Connect Supabase to load live plan data.</p>
    </div>
  )
  const propertyTypes = await getDimensionsByType(segment.id, "property_type")

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <nav className="text-sm text-gray-500 flex gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Landlord Insurance</span>
      </nav>

      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Best Landlord Insurance ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Standard homeowners insurance doesn't cover rental properties. Compare specialist landlord
          insurance policies for short-term rentals, multi-family, and vacation homes.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Property Type</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {propertyTypes.map((pt) => (
            <Link
              key={pt.slug}
              href={`/landlord-insurance/${pt.slug}`}
              className="group rounded-xl border bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-gray-900 group-hover:text-blue-700">{pt.label}</div>
                {!!(pt.metadata as Record<string, unknown> | null)?.notes && (
                  <div className="text-sm text-gray-500 mt-1">{((pt.metadata as Record<string, unknown>).notes) as string}</div>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="prose max-w-none">
        <h2>Does Standard Homeowner Insurance Cover Rentals?</h2>
        <p>
          No — most standard homeowner insurance policies specifically exclude coverage when the
          property is rented out, especially for short-term rentals on Airbnb or VRBO. You need
          a dedicated landlord or rental property insurance policy.
        </p>
        <h2>What Does Landlord Insurance Cover?</h2>
        <ul>
          <li>Building and structural damage</li>
          <li>Rental income loss if property becomes uninhabitable</li>
          <li>Liability protection if a tenant or guest is injured</li>
          <li>Landlord personal property (appliances, furniture in common areas)</li>
        </ul>
      </div>
    </div>
  )
}
