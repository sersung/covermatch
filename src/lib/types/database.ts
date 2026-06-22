export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface InsuranceSegment {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  active: boolean
}

export interface Provider {
  id: string
  name: string
  logo_url: string | null
  affiliate_link: string | null
  affiliate_network: string | null
  commission_type: string | null
  commission_value: number | null
  cookie_days: number | null
  active: boolean
}

export interface Plan {
  id: string
  provider_id: string
  segment_id: string
  name: string
  monthly_premium_usd: number | null
  annual_deductible_usd: number | null
  reimbursement_pct: number | null
  coverage_limit_usd: number | null
  waiting_period_days: number | null
  highlights: string[]
  pros: string[]
  cons: string[]
  rating: number | null
  affiliate_url: string | null
  last_updated: string
}

export interface SegmentDimension {
  id: string
  segment_id: string
  dimension_type: string
  slug: string
  label: string
  metadata: Json | null
}

export interface PlanCoverageRule {
  id: string
  plan_id: string
  dimension_id: string
  covers: boolean
  surcharge_pct: number
  notes: string | null
}

export interface SavedQuote {
  id: string
  user_id: string
  segment_id: string
  input_data: Json
  result_snapshot: Json | null
  created_at: string
  label: string | null
  is_paid: boolean
  stripe_session_id: string | null
}

export type PlanWithProvider = Plan & {
  providers: Provider
  plan_coverage_rules: (PlanCoverageRule & { segment_dimensions: SegmentDimension })[]
}
