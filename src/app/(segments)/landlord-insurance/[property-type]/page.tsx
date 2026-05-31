import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSegmentBySlug, getDimensionBySlug, getSegmentDimensions } from "@/lib/queries/segments"

type Props = { params: Promise<{ "property-type": string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("landlord-insurance")
  if (!seg) return []
  const dims = await getSegmentDimensions(seg.id)
  return dims.map((d) => ({ "property-type": d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params)["property-type"]
  const segment = await getSegmentBySlug("landlord-insurance")
  if (!segment) return {}
  const dim = await getDimensionBySlug(segment.id, slug)
  if (!dim) return {}
  return {
    title: `${dim.label} Landlord Insurance (${new Date().getFullYear()})`,
    description: `Compare landlord insurance for ${dim.label.toLowerCase()}. Find coverage for rental income, liability, and property damage.`,
  }
}

export default async function LandlordPropertyTypePage({ params }: Props) {
  const propSlug = (await params)["property-type"]
  const segment = await getSegmentBySlug("landlord-insurance")
  if (!segment) return notFound()
  const dim = await getDimensionBySlug(segment.id, propSlug)
  if (!dim) return notFound()
  const meta = dim.metadata as Record<string, unknown> | null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <nav className="text-sm text-gray-500 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/landlord-insurance" className="hover:text-blue-600">Landlord Insurance</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{dim.label}</span>
      </nav>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {dim.label} Insurance ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          {(meta?.notes as string) ?? `Compare landlord insurance for ${dim.label.toLowerCase()}.`}
        </p>
      </div>

      <div className="prose max-w-none">
        <h2>Insurance Requirements for {dim.label}</h2>
        {propSlug === "short-term-rental" ? (
          <>
            <p>
              Short-term rental properties (Airbnb, VRBO, etc.) require specialized insurance
              because standard homeowner and landlord policies typically exclude commercial
              short-term rental activity. Key coverage to look for:
            </p>
            <ul>
              <li><strong>Host liability protection:</strong> Covers guest injuries — often $1M+</li>
              <li><strong>Property damage by guests:</strong> Airbnb's own AirCover has limits; third-party insurance is more comprehensive</li>
              <li><strong>Rental income loss:</strong> If the property is damaged and can't be rented</li>
              <li><strong>Business property:</strong> Furniture, appliances, and equipment</li>
            </ul>
          </>
        ) : (
          <p>
            Compare comprehensive landlord insurance options for {dim.label.toLowerCase()}.
            Ensure your policy covers rental income interruption, liability, and the building itself.
          </p>
        )}
      </div>

      <Link href="/landlord-insurance" className="inline-flex items-center text-blue-600 hover:underline text-sm">
        ← Back to Landlord Insurance Hub
      </Link>
    </div>
  )
}
