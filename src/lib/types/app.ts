import type {
  InsuranceSegment,
  Provider,
  Plan,
  SegmentDimension,
  PlanCoverageRule,
  SavedQuote,
} from "@prisma/client"

export type { InsuranceSegment, Provider, Plan, SegmentDimension, PlanCoverageRule, SavedQuote }

export type PlanWithProvider = Plan & {
  provider: Provider
  coverageRules: (PlanCoverageRule & { dimension: SegmentDimension })[]
}

export type SavedQuoteWithSegment = SavedQuote & {
  segment: Pick<InsuranceSegment, "id" | "name" | "slug" | "icon"> | null
}
