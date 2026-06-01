import { prisma } from "@/lib/prisma"
import type {
  InsuranceSegment,
  SegmentDimension,
  PlanWithProvider,
} from "@/lib/types/app"

async function safeQuery<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

export async function getSegmentBySlug(slug: string): Promise<InsuranceSegment | null> {
  return safeQuery(() =>
    prisma.insuranceSegment.findFirst({
      where: { slug, active: true },
    })
  )
}

export async function getDimensionBySlug(
  segmentId: string,
  slug: string
): Promise<SegmentDimension | null> {
  return safeQuery(() =>
    prisma.segmentDimension.findFirst({
      where: { segmentId, slug },
    })
  )
}

export async function getSegmentDimensions(segmentId: string): Promise<SegmentDimension[]> {
  const result = await safeQuery(() =>
    prisma.segmentDimension.findMany({
      where: { segmentId },
      orderBy: { label: "asc" },
    })
  )
  return result ?? []
}

export async function getDimensionsByType(
  segmentId: string,
  type: string
): Promise<SegmentDimension[]> {
  const result = await safeQuery(() =>
    prisma.segmentDimension.findMany({
      where: { segmentId, dimensionType: type },
      orderBy: { label: "asc" },
    })
  )
  return result ?? []
}

export async function getPlansBySegment(segmentId: string): Promise<PlanWithProvider[]> {
  const result = await safeQuery(() =>
    prisma.plan.findMany({
      where: { segmentId },
      orderBy: { rating: "desc" },
      include: {
        provider: true,
        coverageRules: {
          include: { dimension: true },
        },
      },
    })
  )
  return (result ?? []) as PlanWithProvider[]
}

export async function getPlansBySegmentAndDimension(
  segmentId: string,
  dimensionId: string
): Promise<PlanWithProvider[]> {
  const result = await safeQuery(() =>
    prisma.plan.findMany({
      where: {
        segmentId,
        coverageRules: { some: { dimensionId } },
      },
      orderBy: { rating: "desc" },
      include: {
        provider: true,
        coverageRules: {
          include: { dimension: true },
        },
      },
    })
  )
  return (result ?? []) as PlanWithProvider[]
}
