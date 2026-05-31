import { createAnonSupabaseClient } from "@/lib/supabase/server"
import type { InsuranceSegment, SegmentDimension, PlanWithProvider } from "@/lib/types/database"

async function safeQuery<T>(fn: () => Promise<T | null>): Promise<T | null> {
  try {
    return await fn()
  } catch {
    return null
  }
}

export async function getSegmentBySlug(slug: string): Promise<InsuranceSegment | null> {
  return safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("insurance_segments")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single()
    return data
  })
}

export async function getDimensionBySlug(segmentId: string, slug: string): Promise<SegmentDimension | null> {
  return safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("segment_dimensions")
      .select("*")
      .eq("segment_id", segmentId)
      .eq("slug", slug)
      .single()
    return data
  })
}

export async function getSegmentDimensions(segmentId: string): Promise<SegmentDimension[]> {
  const result = await safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("segment_dimensions")
      .select("*")
      .eq("segment_id", segmentId)
      .order("label")
    return data
  })
  return result ?? []
}

export async function getDimensionsByType(segmentId: string, type: string): Promise<SegmentDimension[]> {
  const result = await safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("segment_dimensions")
      .select("*")
      .eq("segment_id", segmentId)
      .eq("dimension_type", type)
      .order("label")
    return data
  })
  return result ?? []
}

export async function getPlansBySegment(segmentId: string): Promise<PlanWithProvider[]> {
  const result = await safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("plans")
      .select(`
        *,
        providers (*),
        plan_coverage_rules (
          *,
          segment_dimensions (*)
        )
      `)
      .eq("segment_id", segmentId)
      .order("rating", { ascending: false })
    return data
  })
  return result ?? []
}

export async function getPlansBySegmentAndDimension(segmentId: string, dimensionId: string): Promise<PlanWithProvider[]> {
  const result = await safeQuery(async () => {
    const supabase = await createAnonSupabaseClient()
    const { data } = await supabase
      .from("plans")
      .select(`
        *,
        providers (*),
        plan_coverage_rules!inner (
          *,
          segment_dimensions (*)
        )
      `)
      .eq("segment_id", segmentId)
      .eq("plan_coverage_rules.dimension_id", dimensionId)
      .order("rating", { ascending: false })
    return data
  })
  return result ?? []
}
