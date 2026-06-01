"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, TrendingDown } from "lucide-react"
import dynamic from "next/dynamic"

const SaveButton = dynamic(() => import("@/components/insurance/SaveButton"), { ssr: false })

type Plan = {
  id: string
  name: string
  monthlyPremiumUsd: number | null
  reimbursementPct: number | null
  affiliateUrl: string | null
  rating: number | null
  provider: { name: string; logoUrl: string | null }
  coverageRules: Array<{
    covers: boolean
    surchargePct: number
    dimension: { slug: string; label: string; dimensionType: string }
  }>
}

type Props = {
  plans: Plan[]
  segmentSlug: string
  dimensionSlug?: string
  segmentId: string
}

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC",
  "ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]

const STATE_MULTIPLIERS: Record<string, number> = {
  CA: 1.25, NY: 1.22, MA: 1.18, WA: 1.15, CO: 1.10,
  TX: 1.05, FL: 1.08, IL: 1.06, GA: 1.02, OH: 0.98,
}

function getStateMultiplier(state: string) {
  return STATE_MULTIPLIERS[state] ?? 1.0
}

function estimatePlan(
  plan: Plan,
  petAge: number,
  annualVetCost: number,
  state: string,
  activeDimensionSlug?: string
) {
  const base = plan.monthlyPremiumUsd ?? 40
  const reimb = (plan.reimbursementPct ?? 80) / 100

  const ageMultiplier = petAge > 9 ? 1.5 : petAge > 7 ? 1.3 : petAge > 4 ? 1.1 : 1.0
  const stateMult = getStateMultiplier(state)

  let surcharge = 0
  if (activeDimensionSlug) {
    const rule = plan.coverageRules.find(
      (r) => r.dimension.slug === activeDimensionSlug
    )
    if (rule) surcharge = rule.surchargePct / 100
  }

  const monthly = base * (1 + surcharge) * ageMultiplier * stateMult
  const annualSavings = annualVetCost * reimb
  const netMonthly = monthly - annualSavings / 12

  return {
    monthly: monthly.toFixed(2),
    netMonthly: netMonthly.toFixed(2),
    annualSavings: annualSavings.toFixed(0),
    coversCondition: activeDimensionSlug
      ? plan.coverageRules.find(
          (r) => r.dimension.slug === activeDimensionSlug
        )?.covers ?? null
      : null,
  }
}

export function InsuranceCalculator({ plans, segmentSlug, dimensionSlug, segmentId }: Props) {
  const [petAge, setPetAge] = useState(3)
  const [annualVetCost, setAnnualVetCost] = useState(1200)
  const [state, setState] = useState("CA")
  const [saving, setSaving] = useState(false)

  async function handleSaveQuote() {
    setSaving(true)
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmentId,
          inputData: { petAge, annualVetCost, state, dimensionSlug, segmentSlug },
          resultSnapshot: plans.map((p) => ({
            planName: p.name,
            ...estimatePlan(p, petAge, annualVetCost, state, dimensionSlug),
          })),
          label: `${segmentSlug}${dimensionSlug ? ` — ${dimensionSlug}` : ""}`,
        }),
      })
      if (res.ok) toast.success("Quote saved to your dashboard!")
      else toast.error("Failed to save quote.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Estimate Your Premium</h3>
        <Badge variant="secondary">Free Tool</Badge>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Pet Age: <span className="font-bold text-blue-700">{petAge} yrs</span></Label>
          <Slider
            min={1} max={15} step={1}
            value={[petAge]}
            onValueChange={(v) => setPetAge(Array.isArray(v) ? v[0] : v)}
          />
        </div>

        <div className="space-y-2">
          <Label>Annual Vet Cost: <span className="font-bold text-blue-700">${annualVetCost.toLocaleString()}</span></Label>
          <Slider
            min={200} max={8000} step={100}
            value={[annualVetCost]}
            onValueChange={(v) => setAnnualVetCost(Array.isArray(v) ? v[0] : v)}
          />
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Select value={state} onValueChange={(v) => { if (v) setState(v) }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        {plans.map((plan) => {
          const est = estimatePlan(plan, petAge, annualVetCost, state, dimensionSlug)
          return (
            <div
              key={plan.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{plan.provider.name}</span>
                  {plan.rating && (
                    <Badge variant="secondary" className="text-xs">★ {plan.rating}</Badge>
                  )}
                  {est.coversCondition === false && (
                    <Badge variant="destructive" className="text-xs">Excludes condition</Badge>
                  )}
                  {est.coversCondition === true && (
                    <Badge className="text-xs bg-green-600">Covers condition</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{plan.name}</p>
                {parseFloat(est.netMonthly) < parseFloat(est.monthly) && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Net after reimbursement: ${est.netMonthly}/mo
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xl font-bold text-gray-900">${est.monthly}<span className="text-sm font-normal text-gray-400">/mo</span></span>
                {plan.affiliateUrl && (
                  <a
                    href={plan.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Get Quote <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Save this estimate to your dashboard and unlock a full PDF comparison report.
        </p>
        <SaveButton onSave={handleSaveQuote} saving={saving} />
      </div>
    </div>
  )
}
