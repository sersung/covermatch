import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, ExternalLink, Clock, DollarSign } from "lucide-react"

type Plan = {
  id: string
  name: string
  monthly_premium_usd: number | null
  annual_deductible_usd: number | null
  reimbursement_pct: number | null
  coverage_limit_usd: number | null
  waiting_period_days: number | null
  rating: number | null
  affiliate_url: string | null
  pros: string[] | null
  cons: string[] | null
  providers: { name: string }
  plan_coverage_rules: Array<{
    covers: boolean
    surcharge_pct: number
    notes: string | null
    segment_dimensions: { slug: string; label: string; dimension_type: string }
  }>
}

type Props = {
  plans: Plan[]
  filterDimensionSlug?: string
  compareSlug?: string
}

export function ComparisonTable({ plans, filterDimensionSlug }: Props) {
  const displayPlans = filterDimensionSlug
    ? [...plans].sort((a, b) => {
        const aCovers = a.plan_coverage_rules.find(
          (r) => r.segment_dimensions.slug === filterDimensionSlug
        )?.covers ?? false
        const bCovers = b.plan_coverage_rules.find(
          (r) => r.segment_dimensions.slug === filterDimensionSlug
        )?.covers ?? false
        return (bCovers ? 1 : 0) - (aCovers ? 1 : 0) || (b.rating ?? 0) - (a.rating ?? 0)
      })
    : plans

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-700 w-48">Provider / Plan</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Monthly</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Deductible</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Reimb.</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Limit</th>
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Waiting</th>
            {filterDimensionSlug && (
              <th className="text-center px-3 py-3 font-semibold text-gray-700">Covers Condition</th>
            )}
            <th className="text-center px-3 py-3 font-semibold text-gray-700">Rating</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {displayPlans.map((plan, idx) => {
            const conditionRule = filterDimensionSlug
              ? plan.plan_coverage_rules.find(
                  (r) => r.segment_dimensions.slug === filterDimensionSlug
                )
              : null

            return (
              <tr
                key={plan.id}
                className={idx === 0 ? "bg-blue-50/50" : "hover:bg-gray-50"}
              >
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <Badge className="text-xs bg-blue-600">Top Pick</Badge>}
                    </div>
                    <div className="font-semibold text-gray-900">{plan.providers.name}</div>
                    <div className="text-xs text-gray-500">{plan.name}</div>
                  </div>
                </td>
                <td className="px-3 py-4 text-center font-bold text-gray-900">
                  {plan.monthly_premium_usd
                    ? `$${plan.monthly_premium_usd}/mo`
                    : <span className="text-gray-400">Varies</span>}
                  {conditionRule?.surcharge_pct ? (
                    <div className="text-xs text-orange-500">+{conditionRule.surcharge_pct}% surcharge</div>
                  ) : null}
                </td>
                <td className="px-3 py-4 text-center text-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    {plan.annual_deductible_usd ?? "Varies"}
                  </div>
                </td>
                <td className="px-3 py-4 text-center">
                  <Badge variant="outline">{plan.reimbursement_pct ?? "—"}%</Badge>
                </td>
                <td className="px-3 py-4 text-center text-gray-700">
                  {plan.coverage_limit_usd
                    ? `$${(plan.coverage_limit_usd / 1000).toFixed(0)}k`
                    : <span className="text-green-600 font-medium">Unlimited</span>}
                </td>
                <td className="px-3 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {plan.waiting_period_days ?? "—"}d
                  </div>
                </td>
                {filterDimensionSlug && (
                  <td className="px-3 py-4 text-center">
                    {conditionRule ? (
                      conditionRule.covers ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          {conditionRule.notes && (
                            <span className="text-xs text-gray-500 max-w-24 text-center leading-tight">{conditionRule.notes}</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <XCircle className="w-5 h-5 text-red-400" />
                          {conditionRule.notes && (
                            <span className="text-xs text-gray-500 max-w-24 text-center leading-tight">{conditionRule.notes}</span>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}
                <td className="px-3 py-4 text-center">
                  <span className="font-semibold">★ {plan.rating?.toFixed(1) ?? "—"}</span>
                </td>
                <td className="px-3 py-4 text-right">
                  {plan.affiliate_url && (
                    <a
                      href={plan.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Get Quote <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function PlanProsCons({ plan }: { plan: Plan }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4 rounded-lg border bg-white p-4">
      <div>
        <p className="font-semibold text-green-700 mb-2 text-sm">Pros</p>
        <ul className="space-y-1">
          {(plan.pros ?? []).map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-semibold text-red-600 mb-2 text-sm">Cons</p>
        <ul className="space-y-1">
          {(plan.cons ?? []).map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
              <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
