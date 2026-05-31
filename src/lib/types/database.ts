export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      insurance_segments: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['insurance_segments']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['insurance_segments']['Insert']>
      }
      providers: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['providers']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['providers']['Insert']>
      }
      plans: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['plans']['Insert']>
      }
      segment_dimensions: {
        Row: {
          id: string
          segment_id: string
          dimension_type: string
          slug: string
          label: string
          metadata: Json | null
        }
        Insert: Omit<Database['public']['Tables']['segment_dimensions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['segment_dimensions']['Insert']>
      }
      plan_coverage_rules: {
        Row: {
          id: string
          plan_id: string
          dimension_id: string
          covers: boolean
          surcharge_pct: number
          notes: string | null
        }
        Insert: Omit<Database['public']['Tables']['plan_coverage_rules']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['plan_coverage_rules']['Insert']>
      }
      saved_quotes: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['saved_quotes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['saved_quotes']['Insert']>
      }
    }
  }
}

export type InsuranceSegment = Database['public']['Tables']['insurance_segments']['Row']
export type Provider = Database['public']['Tables']['providers']['Row']
export type Plan = Database['public']['Tables']['plans']['Row']
export type SegmentDimension = Database['public']['Tables']['segment_dimensions']['Row']
export type PlanCoverageRule = Database['public']['Tables']['plan_coverage_rules']['Row']
export type SavedQuote = Database['public']['Tables']['saved_quotes']['Row']

export type PlanWithProvider = Plan & {
  providers: Provider
  plan_coverage_rules: (PlanCoverageRule & { segment_dimensions: SegmentDimension })[]
}
