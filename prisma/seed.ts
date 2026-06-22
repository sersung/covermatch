import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  await prisma.$transaction(async (tx) => {
    // Clear in reverse FK order
    await tx.planCoverageRule.deleteMany()
    await tx.plan.deleteMany()
    await tx.segmentDimension.deleteMany()
    await tx.provider.deleteMany()
    await tx.savedQuote.deleteMany()
    await tx.insuranceSegment.deleteMany()

    // ── Segments ──────────────────────────────────────────────
    const petSeg = await tx.insuranceSegment.create({
      data: { slug: "pet-insurance", name: "Pet Insurance", description: "Coverage for dogs, cats, and exotic pets", icon: "🐾" },
    })
    const finalSeg = await tx.insuranceSegment.create({
      data: { slug: "final-expense", name: "Final Expense", description: "Burial and end-of-life insurance plans", icon: "🕊️" },
    })
    const lifeSeg = await tx.insuranceSegment.create({
      data: { slug: "life-insurance", name: "Life Insurance", description: "Term and whole life coverage", icon: "❤️" },
    })
    const travelSeg = await tx.insuranceSegment.create({
      data: { slug: "travel-insurance", name: "Travel Insurance", description: "International travel and visa-compliant coverage", icon: "✈️" },
    })
    const landlordSeg = await tx.insuranceSegment.create({
      data: { slug: "landlord-insurance", name: "Landlord Insurance", description: "Property and rental income protection", icon: "🏠" },
    })

    // ── Pet Providers ─────────────────────────────────────────
    const hp    = await tx.provider.create({ data: { name: "Healthy Paws",  affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 36, cookieDays: 30 } })
    const trup  = await tx.provider.create({ data: { name: "Trupanion",     affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 45, cookieDays: 30 } })
    const spot  = await tx.provider.create({ data: { name: "Spot Pet",      affiliateNetwork: "FlexOffers", commissionType: "per_lead", commissionValue: 36, cookieDays: 30 } })
    const fetch = await tx.provider.create({ data: { name: "Fetch Pet",     affiliateNetwork: "Pepperjam",  commissionType: "per_lead", commissionValue: 40, cookieDays: 30 } })
    const figo  = await tx.provider.create({ data: { name: "Figo Pet",      affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 30, cookieDays: 30 } })
    const embr  = await tx.provider.create({ data: { name: "Embrace Pet",   affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 32, cookieDays: 30 } })
    const aspc  = await tx.provider.create({ data: { name: "ASPCA Pet",     affiliateNetwork: "Direct",     commissionType: "per_lead", commissionValue: 28, cookieDays: 45 } })

    // ── Pet Plans ─────────────────────────────────────────────
    const hpPlan = await tx.plan.create({ data: {
      providerId: hp.id, segmentId: petSeg.id, name: "Healthy Paws Complete",
      monthlyPremiumUsd: 45, annualDeductibleUsd: 250, reimbursementPct: 80, waitingPeriodDays: 15, rating: 4.8,
      highlights: ["No annual limit","Fast reimbursement","Covers hereditary conditions"],
      pros: ["Unlimited lifetime coverage","90% reimbursement option","Strong mobile app"],
      cons: ["No wellness add-on","Age restrictions after 14"],
      affiliateUrl: "https://healthypawspetinsurance.com",
    }})
    const trupPlan = await tx.plan.create({ data: {
      providerId: trup.id, segmentId: petSeg.id, name: "Trupanion Medical",
      monthlyPremiumUsd: 55, annualDeductibleUsd: 0, reimbursementPct: 90, waitingPeriodDays: 5, rating: 4.6,
      highlights: ["$0 deductible option","Pays vet directly","No payout limits"],
      pros: ["90% reimbursement","Per-condition deductible","Covers hip dysplasia"],
      cons: ["Higher monthly cost","No wellness coverage","Hereditary conditions may be excluded at enrollment"],
      affiliateUrl: "https://trupanion.com",
    }})
    const spotPlan = await tx.plan.create({ data: {
      providerId: spot.id, segmentId: petSeg.id, name: "Spot Gold Plan",
      monthlyPremiumUsd: 38, annualDeductibleUsd: 500, reimbursementPct: 80, waitingPeriodDays: 14, rating: 4.4,
      highlights: ["Covers exam fees","Flexible deductibles","Wellness add-on available"],
      pros: ["Affordable entry price","Covers curable pre-existing","Wellness options"],
      cons: ["Lower reimbursement cap","Some breed restrictions"],
      affiliateUrl: "https://spotpetinsurance.com",
    }})
    const fetchPlan = await tx.plan.create({ data: {
      providerId: fetch.id, segmentId: petSeg.id, name: "Fetch Complete",
      monthlyPremiumUsd: 42, annualDeductibleUsd: 300, reimbursementPct: 80, coverageLimitUsd: 15000, waitingPeriodDays: 15, rating: 4.3,
      highlights: ["Covers exam fees","Behavioral therapy covered","Dental illness covered"],
      pros: ["Comprehensive coverage","Fast claims","Good for seniors"],
      cons: ["Annual limit","Some exclusions for pre-existing"],
      affiliateUrl: "https://fetchpet.com",
    }})
    const figoPlan = await tx.plan.create({ data: {
      providerId: figo.id, segmentId: petSeg.id, name: "Figo Essential",
      monthlyPremiumUsd: 32, annualDeductibleUsd: 200, reimbursementPct: 70, coverageLimitUsd: 10000, waitingPeriodDays: 14, rating: 4.1,
      highlights: ["Cloud-based claims","24/7 vet helpline","3 deductible options"],
      pros: ["Affordable","Cloud pet tag included","Good customer service"],
      cons: ["Lower reimbursement","Annual cap lower than competitors"],
      affiliateUrl: "https://figopetinsurance.com",
    }})
    const embrPlan = await tx.plan.create({ data: {
      providerId: embr.id, segmentId: petSeg.id, name: "Embrace Wellness Rewards",
      monthlyPremiumUsd: 40, annualDeductibleUsd: 300, reimbursementPct: 80, coverageLimitUsd: 30000, waitingPeriodDays: 14, rating: 4.5,
      highlights: ["Wellness rewards program","Diminishing deductible","Flexible limits"],
      pros: ["Annual limit up to $30k","Diminishing deductible benefit","Covers alternative therapy"],
      cons: ["Wellness is separate add-on","Waiting periods apply"],
      affiliateUrl: "https://embracepetinsurance.com",
    }})
    const aspcPlan = await tx.plan.create({ data: {
      providerId: aspc.id, segmentId: petSeg.id, name: "ASPCA Complete Coverage",
      monthlyPremiumUsd: 35, annualDeductibleUsd: 250, reimbursementPct: 80, coverageLimitUsd: 10000, waitingPeriodDays: 14, rating: 4.2,
      highlights: ["Covers exam fees","Behavioral issues covered","Microchip coverage"],
      pros: ["ASPCA brand trust","Covers alternative therapies","Exam fees included"],
      cons: ["Annual limit","Some breed exclusions"],
      affiliateUrl: "https://aspcapetinsurance.com",
    }})

    // ── Pet Breeds (dimensions) ───────────────────────────────
    await tx.segmentDimension.createMany({ data: [
      { segmentId: petSeg.id, dimensionType: "breed", slug: "french-bulldog",    label: "French Bulldog",      metadata: { avg_annual_vet_usd: 4200, risk_tier: "high",        brachycephalic: true, common_conditions: ["brachycephalic","hip-dysplasia","allergies"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "golden-retriever",  label: "Golden Retriever",    metadata: { avg_annual_vet_usd: 2800, risk_tier: "medium",       cancer_prone: true,   common_conditions: ["hip-dysplasia","allergies","cancer"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "german-shepherd",   label: "German Shepherd",     metadata: { avg_annual_vet_usd: 3100, risk_tier: "medium-high",                         common_conditions: ["hip-dysplasia","degenerative-myelopathy"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "labrador-retriever",label: "Labrador Retriever",  metadata: { avg_annual_vet_usd: 2600, risk_tier: "medium",                               common_conditions: ["hip-dysplasia","obesity","elbow-dysplasia"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "bulldog",           label: "English Bulldog",     metadata: { avg_annual_vet_usd: 3800, risk_tier: "high",        brachycephalic: true, common_conditions: ["brachycephalic","hip-dysplasia","skin-infections"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "poodle",            label: "Poodle",              metadata: { avg_annual_vet_usd: 2200, risk_tier: "low",                                  common_conditions: ["hip-dysplasia","allergies"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "beagle",            label: "Beagle",              metadata: { avg_annual_vet_usd: 1900, risk_tier: "low",                                  common_conditions: ["hip-dysplasia","epilepsy"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "yorkshire-terrier", label: "Yorkshire Terrier",   metadata: { avg_annual_vet_usd: 2100, risk_tier: "medium",                               common_conditions: ["luxating-patella","hypoglycemia"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "dachshund",         label: "Dachshund",           metadata: { avg_annual_vet_usd: 2400, risk_tier: "medium",                               common_conditions: ["ivdd","hip-dysplasia"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "rottweiler",        label: "Rottweiler",          metadata: { avg_annual_vet_usd: 3300, risk_tier: "high",                                 common_conditions: ["hip-dysplasia","osteosarcoma","elbow-dysplasia"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "siberian-husky",    label: "Siberian Husky",      metadata: { avg_annual_vet_usd: 2500, risk_tier: "medium",                               common_conditions: ["hip-dysplasia","eye-conditions"] } },
      { segmentId: petSeg.id, dimensionType: "breed", slug: "maine-coon-cat",    label: "Maine Coon Cat",      metadata: { avg_annual_vet_usd: 1800, risk_tier: "medium",      species: "cat",          common_conditions: ["hcm","hip-dysplasia"] } },
    ]})

    // ── Pet Conditions (dimensions) ───────────────────────────
    const dimPre     = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "pre-existing-condition", label: "Pre-Existing Conditions",  metadata: { coverage_varies: true, notes: "Most insurers exclude pre-existing, some cover curable ones" } } })
    const dimHip     = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "hip-dysplasia",          label: "Hip Dysplasia",            metadata: { common_breeds: ["german-shepherd","golden-retriever","labrador-retriever","rottweiler"], avg_surgery_usd: 5000 } } })
    const dimAllergy = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "allergies",              label: "Allergies & Skin Conditions", metadata: { avg_annual_cost_usd: 1200, type: "chronic" } } })
    const dimBrachy  = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "brachycephalic",         label: "Brachycephalic Syndrome",  metadata: { common_breeds: ["french-bulldog","bulldog","pug"], avg_surgery_usd: 4500 } } })
    const dimCancer  = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "cancer",                 label: "Cancer",                   metadata: { avg_treatment_usd: 10000, common_breeds: ["golden-retriever","rottweiler"] } } })
    const dimDiab    = await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "diabetes",               label: "Diabetes",                 metadata: { avg_annual_management_usd: 3000, type: "chronic" } } })
    await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "epilepsy",     label: "Epilepsy / Seizures", metadata: { avg_annual_management_usd: 2500, type: "chronic" } } })
    await tx.segmentDimension.create({ data: { segmentId: petSeg.id, dimensionType: "condition", slug: "heart-disease", label: "Heart Disease",       metadata: { avg_annual_management_usd: 4000, type: "chronic" } } })

    // ── Coverage Rules ────────────────────────────────────────
    const rules = [
      // Healthy Paws
      { planId: hpPlan.id,   dimensionId: dimPre.id,     covers: false, surchargePct: 0,  notes: "Does not cover pre-existing conditions" },
      { planId: hpPlan.id,   dimensionId: dimHip.id,     covers: true,  surchargePct: 15, notes: "Covers hereditary hip dysplasia if enrolled before symptoms" },
      { planId: hpPlan.id,   dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: hpPlan.id,   dimensionId: dimBrachy.id,  covers: true,  surchargePct: 20, notes: "Brachycephalic breeds incur surcharge" },
      { planId: hpPlan.id,   dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: "Comprehensive cancer coverage" },
      { planId: hpPlan.id,   dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: "Chronic pre-existing — not covered" },
      // Trupanion
      { planId: trupPlan.id, dimensionId: dimPre.id,     covers: false, surchargePct: 0,  notes: "Excludes pre-existing; per-condition deductible" },
      { planId: trupPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 10, notes: "Covers hereditary if enrolled young" },
      { planId: trupPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 0,  notes: null },
      { planId: trupPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 15, notes: null },
      { planId: trupPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: trupPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
      // Spot Pet
      { planId: spotPlan.id, dimensionId: dimPre.id,     covers: true,  surchargePct: 25, notes: "Covers curable pre-existing after 180-day waiting period" },
      { planId: spotPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 10, notes: null },
      { planId: spotPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: spotPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 18, notes: null },
      { planId: spotPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: spotPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
      // Fetch Pet
      { planId: fetchPlan.id, dimensionId: dimPre.id,     covers: false, surchargePct: 0,  notes: null },
      { planId: fetchPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 12, notes: null },
      { planId: fetchPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: fetchPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 20, notes: null },
      { planId: fetchPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: fetchPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
      // Figo Pet
      { planId: figoPlan.id, dimensionId: dimPre.id,     covers: false, surchargePct: 0,  notes: null },
      { planId: figoPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 15, notes: null },
      { planId: figoPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: figoPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 20, notes: null },
      { planId: figoPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: figoPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
      // Embrace Pet
      { planId: embrPlan.id, dimensionId: dimPre.id,     covers: true,  surchargePct: 20, notes: "Covers curable pre-existing after 12-month waiting period" },
      { planId: embrPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 10, notes: null },
      { planId: embrPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: embrPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 15, notes: null },
      { planId: embrPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: embrPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
      // ASPCA Pet
      { planId: aspcPlan.id, dimensionId: dimPre.id,     covers: false, surchargePct: 0,  notes: null },
      { planId: aspcPlan.id, dimensionId: dimHip.id,     covers: true,  surchargePct: 12, notes: null },
      { planId: aspcPlan.id, dimensionId: dimAllergy.id, covers: true,  surchargePct: 5,  notes: null },
      { planId: aspcPlan.id, dimensionId: dimBrachy.id,  covers: true,  surchargePct: 18, notes: null },
      { planId: aspcPlan.id, dimensionId: dimCancer.id,  covers: true,  surchargePct: 0,  notes: null },
      { planId: aspcPlan.id, dimensionId: dimDiab.id,    covers: false, surchargePct: 0,  notes: null },
    ]
    await tx.planCoverageRule.createMany({ data: rules })

    // ── Final Expense dimensions ──────────────────────────────
    await tx.segmentDimension.createMany({ data: [
      { segmentId: finalSeg.id, dimensionType: "age_group", slug: "seniors-over-80",          label: "Seniors Over 80",                 metadata: { avg_premium_usd: 95, no_exam_available: true, typical_benefit_usd: 15000 } },
      { segmentId: finalSeg.id, dimensionType: "age_group", slug: "seniors-70-79",             label: "Seniors 70–79",                   metadata: { avg_premium_usd: 62, no_exam_available: true } },
      { segmentId: finalSeg.id, dimensionType: "age_group", slug: "seniors-60-69",             label: "Seniors 60–69",                   metadata: { avg_premium_usd: 42, no_exam_available: true } },
      { segmentId: finalSeg.id, dimensionType: "feature",   slug: "no-medical-exam",           label: "No Medical Exam Required",        metadata: { instant_approval: true } },
      { segmentId: finalSeg.id, dimensionType: "feature",   slug: "guaranteed-acceptance",     label: "Guaranteed Acceptance",           metadata: { notes: "No health questions, higher premium" } },
      { segmentId: finalSeg.id, dimensionType: "feature",   slug: "final-expense-diabetics",   label: "Final Expense for Diabetics",     metadata: { notes: "Some insurers cover Type 1 and Type 2" } },
    ]})

    // ── Travel Insurance dimensions ───────────────────────────
    await tx.segmentDimension.createMany({ data: [
      { segmentId: travelSeg.id, dimensionType: "visa_type",   slug: "schengen-visa",         label: "Schengen Visa",             metadata: { min_coverage_eur: 30000, required: true, valid_countries: 27, notes: "EU requirement for non-EU travelers" } },
      { segmentId: travelSeg.id, dimensionType: "visa_type",   slug: "uk-tourist-visa",       label: "UK Tourist Visa",           metadata: { notes: "Recommended but not mandatory" } },
      { segmentId: travelSeg.id, dimensionType: "visa_type",   slug: "us-b1-b2-visa",         label: "US B1/B2 Visitor Visa",     metadata: { notes: "Not mandatory but highly recommended" } },
      { segmentId: travelSeg.id, dimensionType: "destination", slug: "europe",                label: "Europe",                    metadata: undefined },
      { segmentId: travelSeg.id, dimensionType: "destination", slug: "asia",                  label: "Asia",                      metadata: undefined },
      { segmentId: travelSeg.id, dimensionType: "feature",     slug: "cancel-for-any-reason", label: "Cancel For Any Reason",     metadata: undefined },
    ]})

    // ── Life Insurance dimensions ─────────────────────────────
    await tx.segmentDimension.createMany({ data: [
      { segmentId: lifeSeg.id, dimensionType: "condition", slug: "diabetics",            label: "Diabetics",                 metadata: { notes: "Type 1 and Type 2 — rates vary significantly" } },
      { segmentId: lifeSeg.id, dimensionType: "condition", slug: "smokers",              label: "Smokers",                   metadata: { notes: "Rates typically 2–3x higher than non-smokers" } },
      { segmentId: lifeSeg.id, dimensionType: "condition", slug: "heart-disease",        label: "Heart Disease Survivors",   metadata: undefined },
      { segmentId: lifeSeg.id, dimensionType: "condition", slug: "high-risk-occupations",label: "High Risk Occupations",     metadata: undefined },
    ]})

    // ── Landlord Insurance dimensions ─────────────────────────
    await tx.segmentDimension.createMany({ data: [
      { segmentId: landlordSeg.id, dimensionType: "property_type", slug: "short-term-rental", label: "Short-Term Rental (Airbnb)", metadata: { notes: "Standard homeowner policies usually exclude STR" } },
      { segmentId: landlordSeg.id, dimensionType: "property_type", slug: "multi-family",      label: "Multi-Family Property",      metadata: undefined },
      { segmentId: landlordSeg.id, dimensionType: "property_type", slug: "vacation-home",     label: "Vacation Home",              metadata: undefined },
    ]})

    console.log("✅ Seed completed!")
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
