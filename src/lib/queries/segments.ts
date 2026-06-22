import { prisma } from "@/lib/db"
import type { InsuranceSegment, SegmentDimension, PlanWithProvider } from "@/lib/types/database"

async function safeQuery<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

// Map Prisma Decimal to number
function dec(v: unknown): number | null {
  if (v === null || v === undefined) return null
  return Number(v)
}

function mapSegment(s: { id: string; slug: string; name: string; description: string | null; icon: string | null; active: boolean }): InsuranceSegment {
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    description: s.description,
    icon: s.icon,
    active: s.active,
  }
}

function mapDimension(d: {
  id: string; segmentId: string; dimensionType: string; slug: string; label: string; metadata: unknown
}): SegmentDimension {
  return {
    id: d.id,
    segment_id: d.segmentId,
    dimension_type: d.dimensionType,
    slug: d.slug,
    label: d.label,
    metadata: d.metadata as SegmentDimension["metadata"],
  }
}

function mapPlan(p: {
  id: string; providerId: string; segmentId: string; name: string
  monthlyPremiumUsd: unknown; annualDeductibleUsd: unknown; reimbursementPct: unknown
  coverageLimitUsd: unknown; waitingPeriodDays: number | null; highlights: string[]
  pros: string[]; cons: string[]; rating: unknown; affiliateUrl: string | null
  lastUpdated: Date
  provider: { id: string; name: string; logoUrl: string | null; affiliateLink: string | null; affiliateNetwork: string | null; commissionType: string | null; commissionValue: unknown; cookieDays: number | null; active: boolean }
  planCoverageRules: Array<{
    id: string; planId: string; dimensionId: string; covers: boolean; surchargePct: unknown; notes: string | null
    dimension: { id: string; segmentId: string; dimensionType: string; slug: string; label: string; metadata: unknown }
  }>
}): PlanWithProvider {
  return {
    id: p.id,
    provider_id: p.providerId,
    segment_id: p.segmentId,
    name: p.name,
    monthly_premium_usd: dec(p.monthlyPremiumUsd),
    annual_deductible_usd: dec(p.annualDeductibleUsd),
    reimbursement_pct: dec(p.reimbursementPct),
    coverage_limit_usd: dec(p.coverageLimitUsd),
    waiting_period_days: p.waitingPeriodDays,
    highlights: p.highlights,
    pros: p.pros,
    cons: p.cons,
    rating: dec(p.rating),
    affiliate_url: p.affiliateUrl,
    last_updated: p.lastUpdated.toISOString(),
    providers: {
      id: p.provider.id,
      name: p.provider.name,
      logo_url: p.provider.logoUrl,
      affiliate_link: p.provider.affiliateLink,
      affiliate_network: p.provider.affiliateNetwork,
      commission_type: p.provider.commissionType,
      commission_value: dec(p.provider.commissionValue),
      cookie_days: p.provider.cookieDays,
      active: p.provider.active,
    },
    plan_coverage_rules: p.planCoverageRules.map((r) => ({
      id: r.id,
      plan_id: r.planId,
      dimension_id: r.dimensionId,
      covers: r.covers,
      surcharge_pct: dec(r.surchargePct) ?? 0,
      notes: r.notes,
      segment_dimensions: {
        id: r.dimension.id,
        segment_id: r.dimension.segmentId,
        dimension_type: r.dimension.dimensionType,
        slug: r.dimension.slug,
        label: r.dimension.label,
        metadata: r.dimension.metadata as SegmentDimension["metadata"],
      },
    })),
  }
}

const planInclude = {
  provider: true,
  planCoverageRules: { include: { dimension: true } },
} as const

export async function getSegmentBySlug(slug: string): Promise<InsuranceSegment | null> {
  return safeQuery(async () => {
    const s = await prisma.insuranceSegment.findFirst({ where: { slug, active: true } })
    return s ? mapSegment(s) : null
  })
}

export async function getDimensionBySlug(segmentId: string, slug: string): Promise<SegmentDimension | null> {
  return safeQuery(async () => {
    const d = await prisma.segmentDimension.findFirst({ where: { segmentId, slug } })
    return d ? mapDimension(d) : null
  })
}

export async function getSegmentDimensions(segmentId: string): Promise<SegmentDimension[]> {
  const result = await safeQuery(async () => {
    const dims = await prisma.segmentDimension.findMany({ where: { segmentId }, orderBy: { label: "asc" } })
    return dims.map(mapDimension)
  })
  return result ?? []
}

export async function getDimensionsByType(segmentId: string, type: string): Promise<SegmentDimension[]> {
  const result = await safeQuery(async () => {
    const dims = await prisma.segmentDimension.findMany({
      where: { segmentId, dimensionType: type },
      orderBy: { label: "asc" },
    })
    return dims.map(mapDimension)
  })
  return result ?? []
}

export async function getPlansBySegment(segmentId: string): Promise<PlanWithProvider[]> {
  const result = await safeQuery(async () => {
    const plans = await prisma.plan.findMany({
      where: { segmentId },
      include: planInclude,
      orderBy: { rating: "desc" },
    })
    return plans.map(mapPlan)
  })
  return result ?? []
}

export async function getPlansBySegmentAndDimension(segmentId: string, _dimensionId: string): Promise<PlanWithProvider[]> {
  // Return all plans for the segment — filtering by dimension is done client-side in ComparisonTable
  return getPlansBySegment(segmentId)
}
