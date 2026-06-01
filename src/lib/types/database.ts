export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Standalone row types (no self-reference) to avoid Omit<Database[...]> resolving to never
type InsuranceSegmentRow = {
  id: string
  slug: string
  name: string
  description: string | null
  active: boolean
}

type ProviderRow = {
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

type PlanRow = {
  id: string
  provider_id: string
  segment_id: string
  name: string
  monthly_premium_usd: number | null
  annual_deductible_usd: number | null
  reimbursement_pct: number | null
  coverage_limit_usd: number | null
  waiting_period_days: number | null
  highlights: string[] | null
  pros: string[] | null
  cons: string[] | null
  rating: number | null
  affiliate_url: string | null
  last_updated: string
}

type SegmentDimensionRow = {
  id: string
  segment_id: string
  dimension_type: string
  slug: string
  label: string
  metadata: Json | null
}

type PlanCoverageRuleRow = {
  id: string
  plan_id: string
  dimension_id: string
  covers: boolean
  surcharge_pct: number
  notes: string | null
}

type SavedQuoteRow = {
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

export interface Database {
  public: {
    Tables: {
      insurance_segments: {
        Row: InsuranceSegmentRow
        Insert: Omit<InsuranceSegmentRow, 'id'>
        Update: Partial<Omit<InsuranceSegmentRow, 'id'>>
      }
      providers: {
        Row: ProviderRow
        Insert: Omit<ProviderRow, 'id'>
        Update: Partial<Omit<ProviderRow, 'id'>>
      }
      plans: {
        Row: PlanRow
        Insert: Omit<PlanRow, 'id'>
        Update: Partial<Omit<PlanRow, 'id'>>
      }
      segment_dimensions: {
        Row: SegmentDimensionRow
        Insert: Omit<SegmentDimensionRow, 'id'>
        Update: Partial<Omit<SegmentDimensionRow, 'id'>>
      }
      plan_coverage_rules: {
        Row: PlanCoverageRuleRow
        Insert: Omit<PlanCoverageRuleRow, 'id'>
        Update: Partial<Omit<PlanCoverageRuleRow, 'id'>>
      }
      saved_quotes: {
        Row: SavedQuoteRow
        Insert: Omit<SavedQuoteRow, 'id' | 'created_at'>
        Update: Partial<Omit<SavedQuoteRow, 'id' | 'created_at'>>
      }
    }
  }
}

export type InsuranceSegment = InsuranceSegmentRow
export type Provider = ProviderRow
export type Plan = PlanRow
export type SegmentDimension = SegmentDimensionRow
export type PlanCoverageRule = PlanCoverageRuleRow
export type SavedQuote = SavedQuoteRow

export type PlanWithProvider = Plan & {
  providers: Provider
  plan_coverage_rules: (PlanCoverageRule & { segment_dimensions: SegmentDimension })[]
}
