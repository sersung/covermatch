import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database…")

  // ── Segments ────────────────────────────────────────────────────────────────
  const [petSeg, finalSeg, lifeSeg, travelSeg, landlordSeg] = await Promise.all([
    prisma.insuranceSegment.upsert({
      where: { slug: "pet-insurance" },
      update: {},
      create: { slug: "pet-insurance", name: "Pet Insurance", description: "Coverage for dogs, cats, and exotic pets", icon: "🐾", active: true },
    }),
    prisma.insuranceSegment.upsert({
      where: { slug: "final-expense" },
      update: {},
      create: { slug: "final-expense", name: "Final Expense", description: "Burial and end-of-life insurance plans", icon: "🕊️", active: true },
    }),
    prisma.insuranceSegment.upsert({
      where: { slug: "life-insurance" },
      update: {},
      create: { slug: "life-insurance", name: "Life Insurance", description: "Term and whole life coverage", icon: "❤️", active: true },
    }),
    prisma.insuranceSegment.upsert({
      where: { slug: "travel-insurance" },
      update: {},
      create: { slug: "travel-insurance", name: "Travel Insurance", description: "International travel and visa-compliant coverage", icon: "✈️", active: true },
    }),
    prisma.insuranceSegment.upsert({
      where: { slug: "landlord-insurance" },
      update: {},
      create: { slug: "landlord-insurance", name: "Landlord Insurance", description: "Property and rental income protection", icon: "🏠", active: true },
    }),
  ])

  // ── Providers (Pet Insurance) ───────────────────────────────────────────────
  const providerData = [
    { name: "Healthy Paws",  slug: "healthy-paws",  affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 36, cookieDays: 30 },
    { name: "Trupanion",     slug: "trupanion",     affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 45, cookieDays: 30 },
    { name: "Spot Pet",      slug: "spot-pet",      affiliateNetwork: "FlexOffers", commissionType: "per_lead", commissionValue: 36, cookieDays: 30 },
    { name: "Fetch Pet",     slug: "fetch-pet",     affiliateNetwork: "Pepperjam",  commissionType: "per_lead", commissionValue: 40, cookieDays: 30 },
    { name: "Figo Pet",      slug: "figo-pet",      affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 30, cookieDays: 30 },
    { name: "Embrace Pet",   slug: "embrace-pet",   affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 32, cookieDays: 30 },
    { name: "ASPCA Pet",     slug: "aspca-pet",     affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 28, cookieDays: 45 },
  ]

  const providers: Record<string, { id: string }> = {}
  for (const p of providerData) {
    const prov = await prisma.provider.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, active: true },
    })
    providers[p.name] = prov
  }

  // ── Plans (Pet Insurance) ───────────────────────────────────────────────────
  // IMPORTANT: Replace affiliate_url values below with your real affiliate tracking links
  // after signing up for each program (see README or documentation for affiliate links).
  const planData = [
    {
      providerName: "Healthy Paws",
      name: "Healthy Paws Complete",
      monthlyPremiumUsd: 45, annualDeductibleUsd: 250, reimbursementPct: 80, coverageLimitUsd: null, waitingPeriodDays: 15, rating: 4.8,
      highlights: ["No annual limit", "Fast reimbursement", "Covers hereditary conditions"],
      pros: ["Unlimited lifetime coverage", "90% reimbursement option", "Strong mobile app"],
      cons: ["No wellness add-on", "Age restrictions after 14"],
      affiliateUrl: "https://healthypawspetinsurance.com", // REPLACE with affiliate link
    },
    {
      providerName: "Trupanion",
      name: "Trupanion Medical",
      monthlyPremiumUsd: 55, annualDeductibleUsd: 0, reimbursementPct: 90, coverageLimitUsd: null, waitingPeriodDays: 5, rating: 4.6,
      highlights: ["$0 deductible option", "Pays vet directly", "No payout limits"],
      pros: ["90% reimbursement", "Per-condition deductible", "Covers hip dysplasia"],
      cons: ["Higher monthly cost", "No wellness coverage", "Hereditary conditions may be excluded at enrollment"],
      affiliateUrl: "https://trupanion.com", // REPLACE with affiliate link
    },
    {
      providerName: "Spot Pet",
      name: "Spot Gold Plan",
      monthlyPremiumUsd: 38, annualDeductibleUsd: 500, reimbursementPct: 80, coverageLimitUsd: null, waitingPeriodDays: 14, rating: 4.4,
      highlights: ["Covers exam fees", "Flexible deductibles", "Wellness add-on available"],
      pros: ["Affordable entry price", "Covers curable pre-existing", "Wellness options"],
      cons: ["Lower reimbursement cap", "Some breed restrictions"],
      affiliateUrl: "https://spotpetinsurance.com", // REPLACE with affiliate link
    },
    {
      providerName: "Fetch Pet",
      name: "Fetch Complete",
      monthlyPremiumUsd: 42, annualDeductibleUsd: 300, reimbursementPct: 80, coverageLimitUsd: 15000, waitingPeriodDays: 15, rating: 4.3,
      highlights: ["Covers exam fees", "Behavioral therapy covered", "Dental illness covered"],
      pros: ["Comprehensive coverage", "Fast claims", "Good for seniors"],
      cons: ["Annual limit", "Some exclusions for pre-existing"],
      affiliateUrl: "https://fetchpet.com", // REPLACE with affiliate link
    },
    {
      providerName: "Figo Pet",
      name: "Figo Essential",
      monthlyPremiumUsd: 32, annualDeductibleUsd: 200, reimbursementPct: 70, coverageLimitUsd: 10000, waitingPeriodDays: 14, rating: 4.1,
      highlights: ["Cloud-based claims", "24/7 vet helpline", "3 deductible options"],
      pros: ["Affordable", "Cloud pet tag included", "Good customer service"],
      cons: ["Lower reimbursement", "Annual cap lower than competitors"],
      affiliateUrl: "https://figopetinsurance.com", // REPLACE with affiliate link
    },
    {
      providerName: "Embrace Pet",
      name: "Embrace Wellness Rewards",
      monthlyPremiumUsd: 40, annualDeductibleUsd: 300, reimbursementPct: 80, coverageLimitUsd: 30000, waitingPeriodDays: 14, rating: 4.5,
      highlights: ["Wellness rewards program", "Diminishing deductible", "Flexible limits"],
      pros: ["Annual limit up to $30k", "Diminishing deductible benefit", "Covers alternative therapy"],
      cons: ["Wellness is separate add-on", "Waiting periods apply"],
      affiliateUrl: "https://embracepetinsurance.com", // REPLACE with affiliate link
    },
    {
      providerName: "ASPCA Pet",
      name: "ASPCA Complete Coverage",
      monthlyPremiumUsd: 35, annualDeductibleUsd: 250, reimbursementPct: 80, coverageLimitUsd: 10000, waitingPeriodDays: 14, rating: 4.2,
      highlights: ["Covers exam fees", "Behavioral issues covered", "Microchip coverage"],
      pros: ["ASPCA brand trust", "Covers alternative therapies", "Exam fees included"],
      cons: ["Annual limit", "Some breed exclusions"],
      affiliateUrl: "https://aspcapetinsurance.com", // REPLACE with affiliate link
    },
  ]

  const plans: Record<string, { id: string }> = {}
  for (const p of planData) {
    const plan = await prisma.plan.upsert({
      where: { id: (await prisma.plan.findFirst({ where: { name: p.name, segmentId: petSeg.id } }))?.id ?? "new" },
      update: {},
      create: {
        name: p.name,
        segmentId: petSeg.id,
        providerId: providers[p.providerName].id,
        monthlyPremiumUsd: p.monthlyPremiumUsd,
        annualDeductibleUsd: p.annualDeductibleUsd,
        reimbursementPct: p.reimbursementPct,
        coverageLimitUsd: p.coverageLimitUsd,
        waitingPeriodDays: p.waitingPeriodDays,
        rating: p.rating,
        highlights: p.highlights,
        pros: p.pros,
        cons: p.cons,
        affiliateUrl: p.affiliateUrl,
      },
    })
    plans[p.providerName] = plan
  }

  // ── Pet Insurance Dimensions ─────────────────────────────────────────────────
  const breedDims: Record<string, { id: string }> = {}
  const breedData = [
    { slug: "french-bulldog",    label: "French Bulldog",     metadata: { avg_annual_vet_usd: 4200, risk_tier: "high",   brachycephalic: true } },
    { slug: "golden-retriever",  label: "Golden Retriever",   metadata: { avg_annual_vet_usd: 2800, risk_tier: "medium", cancer_prone: true } },
    { slug: "german-shepherd",   label: "German Shepherd",    metadata: { avg_annual_vet_usd: 3100, risk_tier: "medium-high" } },
    { slug: "labrador-retriever",label: "Labrador Retriever", metadata: { avg_annual_vet_usd: 2600, risk_tier: "medium" } },
    { slug: "bulldog",           label: "English Bulldog",    metadata: { avg_annual_vet_usd: 3800, risk_tier: "high",   brachycephalic: true } },
    { slug: "poodle",            label: "Poodle",             metadata: { avg_annual_vet_usd: 2200, risk_tier: "low" } },
    { slug: "beagle",            label: "Beagle",             metadata: { avg_annual_vet_usd: 1900, risk_tier: "low" } },
    { slug: "yorkshire-terrier", label: "Yorkshire Terrier",  metadata: { avg_annual_vet_usd: 2100, risk_tier: "medium" } },
    { slug: "dachshund",         label: "Dachshund",          metadata: { avg_annual_vet_usd: 2400, risk_tier: "medium" } },
    { slug: "rottweiler",        label: "Rottweiler",         metadata: { avg_annual_vet_usd: 3300, risk_tier: "high" } },
    { slug: "siberian-husky",    label: "Siberian Husky",     metadata: { avg_annual_vet_usd: 2500, risk_tier: "medium" } },
    { slug: "maine-coon-cat",    label: "Maine Coon Cat",     metadata: { avg_annual_vet_usd: 1800, risk_tier: "medium", species: "cat" } },
  ]
  for (const b of breedData) {
    const dim = await prisma.segmentDimension.upsert({
      where: { segmentId_slug: { segmentId: petSeg.id, slug: b.slug } },
      update: {},
      create: { segmentId: petSeg.id, dimensionType: "breed", slug: b.slug, label: b.label, metadata: b.metadata },
    })
    breedDims[b.slug] = dim
  }

  const condDims: Record<string, { id: string }> = {}
  const condData = [
    { slug: "pre-existing-condition", label: "Pre-Existing Conditions",     metadata: { coverage_varies: true } },
    { slug: "hip-dysplasia",          label: "Hip Dysplasia",               metadata: { avg_surgery_usd: 5000 } },
    { slug: "allergies",              label: "Allergies & Skin Conditions",  metadata: { avg_annual_cost_usd: 1200, type: "chronic" } },
    { slug: "brachycephalic",         label: "Brachycephalic Syndrome",     metadata: { avg_surgery_usd: 4500 } },
    { slug: "cancer",                 label: "Cancer",                      metadata: { avg_treatment_usd: 10000 } },
    { slug: "diabetes",               label: "Diabetes",                    metadata: { avg_annual_management_usd: 3000, type: "chronic" } },
    { slug: "epilepsy",               label: "Epilepsy / Seizures",         metadata: { avg_annual_management_usd: 2500, type: "chronic" } },
    { slug: "heart-disease",          label: "Heart Disease",               metadata: { avg_annual_management_usd: 4000, type: "chronic" } },
  ]
  for (const c of condData) {
    const dim = await prisma.segmentDimension.upsert({
      where: { segmentId_slug: { segmentId: petSeg.id, slug: c.slug } },
      update: {},
      create: { segmentId: petSeg.id, dimensionType: "condition", slug: c.slug, label: c.label, metadata: c.metadata },
    })
    condDims[c.slug] = dim
  }

  // ── Coverage Rules ────────────────────────────────────────────────────────────
  const coverageMatrix = [
    // [providerName, conditionSlug, covers, surchargePct, notes]
    ["Healthy Paws", "pre-existing-condition", false, 0,  "Does not cover pre-existing conditions"],
    ["Healthy Paws", "hip-dysplasia",          true,  15, "Covers hereditary hip dysplasia if enrolled before symptoms"],
    ["Healthy Paws", "allergies",              true,  5,  null],
    ["Healthy Paws", "brachycephalic",         true,  20, "Brachycephalic breeds incur surcharge"],
    ["Healthy Paws", "cancer",                 true,  0,  "Comprehensive cancer coverage"],
    ["Healthy Paws", "diabetes",               false, 0,  "Chronic pre-existing — not covered"],
    ["Trupanion",    "pre-existing-condition", false, 0,  "Excludes pre-existing; per-condition deductible"],
    ["Trupanion",    "hip-dysplasia",          true,  10, "Covers hereditary if enrolled young"],
    ["Trupanion",    "allergies",              true,  0,  null],
    ["Trupanion",    "brachycephalic",         true,  15, null],
    ["Trupanion",    "cancer",                 true,  0,  null],
    ["Trupanion",    "diabetes",               false, 0,  null],
    ["Spot Pet",     "pre-existing-condition", true,  25, "Covers curable pre-existing after 180-day waiting period"],
    ["Spot Pet",     "hip-dysplasia",          true,  10, null],
    ["Spot Pet",     "allergies",              true,  5,  null],
    ["Spot Pet",     "brachycephalic",         true,  18, null],
    ["Spot Pet",     "cancer",                 true,  0,  null],
    ["Spot Pet",     "diabetes",               false, 0,  null],
    ["Fetch Pet",    "pre-existing-condition", false, 0,  null],
    ["Fetch Pet",    "hip-dysplasia",          true,  12, null],
    ["Fetch Pet",    "allergies",              true,  5,  null],
    ["Fetch Pet",    "brachycephalic",         true,  20, null],
    ["Fetch Pet",    "cancer",                 true,  0,  null],
    ["Fetch Pet",    "diabetes",               false, 0,  null],
    ["Figo Pet",     "pre-existing-condition", false, 0,  null],
    ["Figo Pet",     "hip-dysplasia",          true,  15, null],
    ["Figo Pet",     "allergies",              true,  5,  null],
    ["Figo Pet",     "brachycephalic",         true,  20, null],
    ["Figo Pet",     "cancer",                 true,  0,  null],
    ["Figo Pet",     "diabetes",               false, 0,  null],
    ["Embrace Pet",  "pre-existing-condition", true,  20, "Covers curable pre-existing after 12-month waiting period"],
    ["Embrace Pet",  "hip-dysplasia",          true,  10, null],
    ["Embrace Pet",  "allergies",              true,  5,  null],
    ["Embrace Pet",  "brachycephalic",         true,  15, null],
    ["Embrace Pet",  "cancer",                 true,  0,  null],
    ["Embrace Pet",  "diabetes",               false, 0,  null],
    ["ASPCA Pet",    "pre-existing-condition", false, 0,  null],
    ["ASPCA Pet",    "hip-dysplasia",          true,  12, null],
    ["ASPCA Pet",    "allergies",              true,  5,  null],
    ["ASPCA Pet",    "brachycephalic",         true,  18, null],
    ["ASPCA Pet",    "cancer",                 true,  0,  null],
    ["ASPCA Pet",    "diabetes",               false, 0,  null],
  ] as [string, string, boolean, number, string | null][]

  for (const [prov, cond, covers, surcharge, notes] of coverageMatrix) {
    const planId = plans[prov]?.id
    const dimId  = condDims[cond]?.id
    if (!planId || !dimId) continue
    const existing = await prisma.planCoverageRule.findFirst({ where: { planId, dimensionId: dimId } })
    if (!existing) {
      await prisma.planCoverageRule.create({ data: { planId, dimensionId: dimId, covers, surchargePct: surcharge, notes } })
    }
  }

  // ── Other segment dimensions ─────────────────────────────────────────────────
  const otherDims = [
    // Final Expense
    { segId: finalSeg.id, dimensionType: "age_group", slug: "seniors-over-80", label: "Seniors Over 80",     metadata: { avg_premium_usd: 95, no_exam_available: true } },
    { segId: finalSeg.id, dimensionType: "age_group", slug: "seniors-70-79",   label: "Seniors 70–79",       metadata: { avg_premium_usd: 62, no_exam_available: true } },
    { segId: finalSeg.id, dimensionType: "age_group", slug: "seniors-60-69",   label: "Seniors 60–69",       metadata: { avg_premium_usd: 42, no_exam_available: true } },
    { segId: finalSeg.id, dimensionType: "feature",   slug: "no-medical-exam", label: "No Medical Exam",     metadata: { instant_approval: true } },
    { segId: finalSeg.id, dimensionType: "feature",   slug: "guaranteed-acceptance", label: "Guaranteed Acceptance", metadata: { notes: "No health questions" } },
    { segId: finalSeg.id, dimensionType: "feature",   slug: "final-expense-diabetics", label: "For Diabetics", metadata: {} },
    // Travel Insurance
    { segId: travelSeg.id, dimensionType: "visa_type",    slug: "schengen-visa",  label: "Schengen Visa",        metadata: { min_coverage_eur: 30000, required: true, valid_countries: 27 } },
    { segId: travelSeg.id, dimensionType: "visa_type",    slug: "uk-tourist-visa",label: "UK Tourist Visa",      metadata: {} },
    { segId: travelSeg.id, dimensionType: "visa_type",    slug: "us-b1-b2-visa",  label: "US B1/B2 Visitor Visa",metadata: {} },
    { segId: travelSeg.id, dimensionType: "destination",  slug: "europe",         label: "Europe",               metadata: {} },
    { segId: travelSeg.id, dimensionType: "destination",  slug: "asia",           label: "Asia",                 metadata: {} },
    { segId: travelSeg.id, dimensionType: "feature",      slug: "cancel-for-any-reason", label: "Cancel For Any Reason", metadata: {} },
    // Life Insurance
    { segId: lifeSeg.id,  dimensionType: "condition",    slug: "diabetics",             label: "Diabetics",            metadata: {} },
    { segId: lifeSeg.id,  dimensionType: "condition",    slug: "smokers",               label: "Smokers",              metadata: { notes: "Rates 2-3x higher" } },
    { segId: lifeSeg.id,  dimensionType: "condition",    slug: "heart-disease",         label: "Heart Disease Survivors", metadata: {} },
    { segId: lifeSeg.id,  dimensionType: "condition",    slug: "high-risk-occupations", label: "High Risk Occupations", metadata: {} },
    // Landlord Insurance
    { segId: landlordSeg.id, dimensionType: "property_type", slug: "short-term-rental", label: "Short-Term Rental (Airbnb)", metadata: {} },
    { segId: landlordSeg.id, dimensionType: "property_type", slug: "multi-family",       label: "Multi-Family Property",    metadata: {} },
    { segId: landlordSeg.id, dimensionType: "property_type", slug: "vacation-home",      label: "Vacation Home",            metadata: {} },
  ]

  for (const d of otherDims) {
    await prisma.segmentDimension.upsert({
      where: { segmentId_slug: { segmentId: d.segId, slug: d.slug } },
      update: {},
      create: { segmentId: d.segId, dimensionType: d.dimensionType, slug: d.slug, label: d.label, metadata: d.metadata },
    })
  }

  console.log("✅ Seed complete")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
