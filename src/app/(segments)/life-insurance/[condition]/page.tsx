import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSegmentBySlug, getDimensionBySlug, getSegmentDimensions } from "@/lib/queries/segments"

type Props = { params: Promise<{ condition: string }> }

export async function generateStaticParams() {
  const seg = await getSegmentBySlug("life-insurance")
  if (!seg) return []
  const dims = await getSegmentDimensions(seg.id)
  return dims.map((d) => ({ condition: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { condition: condSlug } = await params
  const segment = await getSegmentBySlug("life-insurance")
  if (!segment) return {}
  const dim = await getDimensionBySlug(segment.id, condSlug)
  if (!dim) return {}
  return {
    title: `Life Insurance for ${dim.label} (${new Date().getFullYear()})`,
    description: `Compare life insurance options for ${dim.label.toLowerCase()}. Find affordable term and whole life policies despite your health condition.`,
  }
}

export default async function LifeInsuranceConditionPage({ params }: Props) {
  const { condition: condSlug } = await params
  const segment = await getSegmentBySlug("life-insurance")
  if (!segment) return notFound()
  const dim = await getDimensionBySlug(segment.id, condSlug)
  if (!dim) return notFound()
  const meta = dim.metadata as Record<string, unknown> | null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <nav className="text-sm text-gray-500 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/life-insurance" className="hover:text-blue-600">Life Insurance</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{dim.label}</span>
      </nav>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Life Insurance for {dim.label} ({new Date().getFullYear()})
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          {(meta?.notes as string) ?? `Compare life insurance options for ${dim.label.toLowerCase()}. Multiple carriers specialize in high-risk applicants.`}
        </p>
      </div>

      <div className="prose max-w-none">
        <h2>Can {dim.label} Get Life Insurance?</h2>
        <p>
          Yes — life insurance is available for {dim.label.toLowerCase()}, but premiums are
          typically higher and some carriers may decline coverage based on the severity of the
          condition, current treatment, and overall health profile.
        </p>
        <h2>Tips for Getting the Best Rate</h2>
        <ul>
          <li>Work with an independent broker who can shop multiple carriers</li>
          <li>Show documented evidence of condition management and stability</li>
          <li>Consider applying after a period of stable health</li>
          <li>Compare both term and whole life options</li>
          <li>Look for carriers that specialize in your specific condition</li>
        </ul>
      </div>

      <Link href="/life-insurance" className="inline-flex items-center text-blue-600 hover:underline text-sm">
        ← Back to Life Insurance Hub
      </Link>
    </div>
  )
}
