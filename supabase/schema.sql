-- ============================================================
-- CoverMatch — Schema completo
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELAS PRINCIPAIS
-- ============================================================

CREATE TABLE IF NOT EXISTS insurance_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  affiliate_link text,
  affiliate_network text,
  commission_type text,
  commission_value numeric,
  cookie_days int,
  active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE,
  segment_id uuid REFERENCES insurance_segments(id) ON DELETE CASCADE,
  name text NOT NULL,
  monthly_premium_usd numeric,
  annual_deductible_usd numeric,
  reimbursement_pct int,
  coverage_limit_usd numeric,
  waiting_period_days int,
  highlights text[],
  pros text[],
  cons text[],
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  affiliate_url text,
  last_updated date DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS segment_dimensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id uuid REFERENCES insurance_segments(id) ON DELETE CASCADE,
  dimension_type text NOT NULL,
  slug text NOT NULL,
  label text NOT NULL,
  metadata jsonb,
  UNIQUE(segment_id, slug)
);

CREATE TABLE IF NOT EXISTS plan_coverage_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE,
  dimension_id uuid REFERENCES segment_dimensions(id) ON DELETE CASCADE,
  covers boolean DEFAULT true,
  surcharge_pct numeric DEFAULT 0,
  notes text
);

CREATE TABLE IF NOT EXISTS saved_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  segment_id uuid REFERENCES insurance_segments(id),
  input_data jsonb NOT NULL,
  result_snapshot jsonb,
  created_at timestamptz DEFAULT now(),
  label text,
  is_paid boolean DEFAULT false,
  stripe_session_id text
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE saved_quotes ENABLE ROW LEVEL SECURITY;

-- Política: usuário acessa apenas suas próprias cotações (Clerk JWT via sub claim)
CREATE POLICY "Users can view own quotes"
  ON saved_quotes FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can insert own quotes"
  ON saved_quotes FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

CREATE POLICY "Users can update own quotes"
  ON saved_quotes FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

-- ============================================================
-- SEED: SEGMENTOS
-- ============================================================

INSERT INTO insurance_segments (slug, name, description, icon) VALUES
  ('pet-insurance',      'Pet Insurance',       'Coverage for dogs, cats, and exotic pets',           '🐾'),
  ('final-expense',      'Final Expense',        'Burial and end-of-life insurance plans',            '🕊️'),
  ('life-insurance',     'Life Insurance',       'Term and whole life coverage',                      '❤️'),
  ('travel-insurance',   'Travel Insurance',     'International travel and visa-compliant coverage',  '✈️'),
  ('landlord-insurance', 'Landlord Insurance',   'Property and rental income protection',             '🏠')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: PROVIDERS — Pet Insurance
-- ============================================================

INSERT INTO providers (name, affiliate_network, commission_type, commission_value, cookie_days, active) VALUES
  ('Healthy Paws',    'Direct',      'per_lead', 36,   30, true),
  ('Trupanion',       'Direct',      'per_lead', 45,   30, true),
  ('Spot Pet',        'FlexOffers',  'per_lead', 36,   30, true),
  ('Fetch Pet',       'Pepperjam',   'per_lead', 40,   30, true),
  ('Figo Pet',        'Direct',      'per_lead', 30,   30, true),
  ('Embrace Pet',     'Direct',      'per_lead', 32,   30, true),
  ('ASPCA Pet',       'Direct',      'per_lead', 28,   45, true);

-- ============================================================
-- SEED: PLANS — Pet Insurance (inserted via DO block to use provider/segment ids)
-- ============================================================

DO $$
DECLARE
  seg_id  uuid;
  p_hp    uuid; p_trup uuid; p_spot uuid;
  p_fetch uuid; p_figo uuid; p_embr uuid; p_aspc uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'pet-insurance';

  SELECT id INTO p_hp   FROM providers WHERE name = 'Healthy Paws';
  SELECT id INTO p_trup FROM providers WHERE name = 'Trupanion';
  SELECT id INTO p_spot FROM providers WHERE name = 'Spot Pet';
  SELECT id INTO p_fetch FROM providers WHERE name = 'Fetch Pet';
  SELECT id INTO p_figo FROM providers WHERE name = 'Figo Pet';
  SELECT id INTO p_embr FROM providers WHERE name = 'Embrace Pet';
  SELECT id INTO p_aspc FROM providers WHERE name = 'ASPCA Pet';

  INSERT INTO plans (provider_id, segment_id, name, monthly_premium_usd, annual_deductible_usd,
    reimbursement_pct, coverage_limit_usd, waiting_period_days, rating,
    highlights, pros, cons, affiliate_url) VALUES
  (p_hp,   seg_id, 'Healthy Paws Complete', 45, 250,  80,  NULL, 15, 4.8,
   ARRAY['No annual limit','Fast reimbursement','Covers hereditary conditions'],
   ARRAY['Unlimited lifetime coverage','90% reimbursement option','Strong mobile app'],
   ARRAY['No wellness add-on','Age restrictions after 14'],
   'https://healthypawspetinsurance.com'),
  (p_trup, seg_id, 'Trupanion Medical',     55, 0,    90,  NULL, 5,  4.6,
   ARRAY['$0 deductible option','Pays vet directly','No payout limits'],
   ARRAY['90% reimbursement','Per-condition deductible','Covers hip dysplasia'],
   ARRAY['Higher monthly cost','No wellness coverage','Hereditary conditions may be excluded at enrollment'],
   'https://trupanion.com'),
  (p_spot, seg_id, 'Spot Gold Plan',        38, 500,  80,  NULL, 14, 4.4,
   ARRAY['Covers exam fees','Flexible deductibles','Wellness add-on available'],
   ARRAY['Affordable entry price','Covers curable pre-existing','Wellness options'],
   ARRAY['Lower reimbursement cap','Some breed restrictions'],
   'https://spotpetinsurance.com'),
  (p_fetch,seg_id, 'Fetch Complete',        42, 300,  80, 15000, 15, 4.3,
   ARRAY['Covers exam fees','Behavioral therapy covered','Dental illness covered'],
   ARRAY['Comprehensive coverage','Fast claims','Good for seniors'],
   ARRAY['Annual limit','Some exclusions for pre-existing'],
   'https://fetchpet.com'),
  (p_figo, seg_id, 'Figo Essential',        32, 200,  70, 10000, 14, 4.1,
   ARRAY['Cloud-based claims','24/7 vet helpline','3 deductible options'],
   ARRAY['Affordable','Cloud pet tag included','Good customer service'],
   ARRAY['Lower reimbursement','Annual cap lower than competitors'],
   'https://figopetinsurance.com'),
  (p_embr, seg_id, 'Embrace Wellness Rewards', 40, 300, 80, 30000, 14, 4.5,
   ARRAY['Wellness rewards program','Diminishing deductible','Flexible limits'],
   ARRAY['Annual limit up to $30k','Diminishing deductible benefit','Covers alternative therapy'],
   ARRAY['Wellness is separate add-on','Waiting periods apply'],
   'https://embracepetinsurance.com'),
  (p_aspc, seg_id, 'ASPCA Complete Coverage', 35, 250, 80, 10000, 14, 4.2,
   ARRAY['Covers exam fees','Behavioral issues covered','Microchip coverage'],
   ARRAY['ASPCA brand trust','Covers alternative therapies','Exam fees included'],
   ARRAY['Annual limit','Some breed exclusions'],
   'https://aspcapetinsurance.com');
END $$;

-- ============================================================
-- SEED: SEGMENT DIMENSIONS — Pet Insurance Breeds
-- ============================================================

DO $$
DECLARE seg_id uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'pet-insurance';

  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'breed','french-bulldog','French Bulldog',
     '{"avg_annual_vet_usd":4200,"risk_tier":"high","brachycephalic":true,"common_conditions":["brachycephalic","hip-dysplasia","allergies"]}'),
    (seg_id,'breed','golden-retriever','Golden Retriever',
     '{"avg_annual_vet_usd":2800,"risk_tier":"medium","cancer_prone":true,"common_conditions":["hip-dysplasia","allergies","cancer"]}'),
    (seg_id,'breed','german-shepherd','German Shepherd',
     '{"avg_annual_vet_usd":3100,"risk_tier":"medium-high","common_conditions":["hip-dysplasia","degenerative-myelopathy"]}'),
    (seg_id,'breed','labrador-retriever','Labrador Retriever',
     '{"avg_annual_vet_usd":2600,"risk_tier":"medium","common_conditions":["hip-dysplasia","obesity","elbow-dysplasia"]}'),
    (seg_id,'breed','bulldog','English Bulldog',
     '{"avg_annual_vet_usd":3800,"risk_tier":"high","brachycephalic":true,"common_conditions":["brachycephalic","hip-dysplasia","skin-infections"]}'),
    (seg_id,'breed','poodle','Poodle',
     '{"avg_annual_vet_usd":2200,"risk_tier":"low","common_conditions":["hip-dysplasia","allergies"]}'),
    (seg_id,'breed','beagle','Beagle',
     '{"avg_annual_vet_usd":1900,"risk_tier":"low","common_conditions":["hip-dysplasia","epilepsy"]}'),
    (seg_id,'breed','yorkshire-terrier','Yorkshire Terrier',
     '{"avg_annual_vet_usd":2100,"risk_tier":"medium","common_conditions":["luxating-patella","hypoglycemia"]}'),
    (seg_id,'breed','dachshund','Dachshund',
     '{"avg_annual_vet_usd":2400,"risk_tier":"medium","common_conditions":["ivdd","hip-dysplasia"]}'),
    (seg_id,'breed','rottweiler','Rottweiler',
     '{"avg_annual_vet_usd":3300,"risk_tier":"high","common_conditions":["hip-dysplasia","osteosarcoma","elbow-dysplasia"]}'),
    (seg_id,'breed','siberian-husky','Siberian Husky',
     '{"avg_annual_vet_usd":2500,"risk_tier":"medium","common_conditions":["hip-dysplasia","eye-conditions"]}'),
    (seg_id,'breed','maine-coon-cat','Maine Coon Cat',
     '{"avg_annual_vet_usd":1800,"risk_tier":"medium","species":"cat","common_conditions":["hcm","hip-dysplasia"]}')
  ON CONFLICT (segment_id, slug) DO NOTHING;

  -- Conditions
  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'condition','pre-existing-condition','Pre-Existing Conditions',
     '{"coverage_varies":true,"notes":"Most insurers exclude pre-existing, some cover curable ones"}'),
    (seg_id,'condition','hip-dysplasia','Hip Dysplasia',
     '{"common_breeds":["german-shepherd","golden-retriever","labrador-retriever","rottweiler"],"avg_surgery_usd":5000}'),
    (seg_id,'condition','allergies','Allergies & Skin Conditions',
     '{"avg_annual_cost_usd":1200,"type":"chronic"}'),
    (seg_id,'condition','brachycephalic','Brachycephalic Syndrome',
     '{"common_breeds":["french-bulldog","bulldog","pug"],"avg_surgery_usd":4500}'),
    (seg_id,'condition','cancer','Cancer',
     '{"avg_treatment_usd":10000,"common_breeds":["golden-retriever","rottweiler"]}'),
    (seg_id,'condition','diabetes','Diabetes',
     '{"avg_annual_management_usd":3000,"type":"chronic"}'),
    (seg_id,'condition','epilepsy','Epilepsy / Seizures',
     '{"avg_annual_management_usd":2500,"type":"chronic"}'),
    (seg_id,'condition','heart-disease','Heart Disease',
     '{"avg_annual_management_usd":4000,"type":"chronic"}')
  ON CONFLICT (segment_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- SEED: SEGMENT DIMENSIONS — Final Expense
-- ============================================================

DO $$
DECLARE seg_id uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'final-expense';

  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'age_group','seniors-over-80','Seniors Over 80',
     '{"avg_premium_usd":95,"no_exam_available":true,"typical_benefit_usd":15000}'),
    (seg_id,'age_group','seniors-70-79','Seniors 70–79',
     '{"avg_premium_usd":62,"no_exam_available":true}'),
    (seg_id,'age_group','seniors-60-69','Seniors 60–69',
     '{"avg_premium_usd":42,"no_exam_available":true}'),
    (seg_id,'feature','no-medical-exam','No Medical Exam Required',
     '{"instant_approval":true}'),
    (seg_id,'feature','guaranteed-acceptance','Guaranteed Acceptance',
     '{"notes":"No health questions, higher premium"}'),
    (seg_id,'feature','final-expense-diabetics','Final Expense for Diabetics',
     '{"notes":"Some insurers cover Type 1 and Type 2"}')
  ON CONFLICT (segment_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- SEED: SEGMENT DIMENSIONS — Travel Insurance
-- ============================================================

DO $$
DECLARE seg_id uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'travel-insurance';

  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'visa_type','schengen-visa','Schengen Visa',
     '{"min_coverage_eur":30000,"required":true,"valid_countries":27,"notes":"EU requirement for non-EU travelers"}'),
    (seg_id,'visa_type','uk-tourist-visa','UK Tourist Visa',
     '{"notes":"Recommended but not mandatory"}'),
    (seg_id,'visa_type','us-b1-b2-visa','US B1/B2 Visitor Visa',
     '{"notes":"Not mandatory but highly recommended"}'),
    (seg_id,'destination','europe','Europe',null),
    (seg_id,'destination','asia','Asia',null),
    (seg_id,'feature','cancel-for-any-reason','Cancel For Any Reason',null)
  ON CONFLICT (segment_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- SEED: SEGMENT DIMENSIONS — Life Insurance
-- ============================================================

DO $$
DECLARE seg_id uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'life-insurance';

  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'condition','diabetics','Diabetics',
     '{"notes":"Type 1 and Type 2 — rates vary significantly"}'),
    (seg_id,'condition','smokers','Smokers',
     '{"notes":"Rates typically 2–3x higher than non-smokers"}'),
    (seg_id,'condition','heart-disease','Heart Disease Survivors',null),
    (seg_id,'condition','high-risk-occupations','High Risk Occupations',null)
  ON CONFLICT (segment_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- SEED: SEGMENT DIMENSIONS — Landlord Insurance
-- ============================================================

DO $$
DECLARE seg_id uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'landlord-insurance';

  INSERT INTO segment_dimensions (segment_id, dimension_type, slug, label, metadata) VALUES
    (seg_id,'property_type','short-term-rental','Short-Term Rental (Airbnb)',
     '{"notes":"Standard homeowner policies usually exclude STR"}'),
    (seg_id,'property_type','multi-family','Multi-Family Property',null),
    (seg_id,'property_type','vacation-home','Vacation Home',null)
  ON CONFLICT (segment_id, slug) DO NOTHING;
END $$;

-- ============================================================
-- COVERAGE RULES — Link plans to dimensions
-- ============================================================

DO $$
DECLARE
  hp_plan_id   uuid; trup_plan_id uuid; spot_plan_id uuid;
  fetch_plan_id uuid; figo_plan_id uuid; embr_plan_id uuid; aspc_plan_id uuid;
  dim_pre  uuid; dim_hip  uuid; dim_allergy uuid;
  dim_brachy uuid; dim_cancer uuid; dim_diabetes uuid;
  seg_id   uuid;
BEGIN
  SELECT id INTO seg_id FROM insurance_segments WHERE slug = 'pet-insurance';

  SELECT p.id INTO hp_plan_id    FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Healthy Paws'  AND p.segment_id=seg_id;
  SELECT p.id INTO trup_plan_id  FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Trupanion'     AND p.segment_id=seg_id;
  SELECT p.id INTO spot_plan_id  FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Spot Pet'      AND p.segment_id=seg_id;
  SELECT p.id INTO fetch_plan_id FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Fetch Pet'     AND p.segment_id=seg_id;
  SELECT p.id INTO figo_plan_id  FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Figo Pet'      AND p.segment_id=seg_id;
  SELECT p.id INTO embr_plan_id  FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='Embrace Pet'   AND p.segment_id=seg_id;
  SELECT p.id INTO aspc_plan_id  FROM plans p JOIN providers pr ON p.provider_id=pr.id WHERE pr.name='ASPCA Pet'     AND p.segment_id=seg_id;

  SELECT id INTO dim_pre     FROM segment_dimensions WHERE segment_id=seg_id AND slug='pre-existing-condition';
  SELECT id INTO dim_hip     FROM segment_dimensions WHERE segment_id=seg_id AND slug='hip-dysplasia';
  SELECT id INTO dim_allergy FROM segment_dimensions WHERE segment_id=seg_id AND slug='allergies';
  SELECT id INTO dim_brachy  FROM segment_dimensions WHERE segment_id=seg_id AND slug='brachycephalic';
  SELECT id INTO dim_cancer  FROM segment_dimensions WHERE segment_id=seg_id AND slug='cancer';
  SELECT id INTO dim_diabetes FROM segment_dimensions WHERE segment_id=seg_id AND slug='diabetes';

  INSERT INTO plan_coverage_rules (plan_id, dimension_id, covers, surcharge_pct, notes) VALUES
    -- Healthy Paws
    (hp_plan_id, dim_pre,      false, 0,    'Does not cover pre-existing conditions'),
    (hp_plan_id, dim_hip,      true,  15,   'Covers hereditary hip dysplasia if enrolled before symptoms'),
    (hp_plan_id, dim_allergy,  true,  5,    null),
    (hp_plan_id, dim_brachy,   true,  20,   'Brachycephalic breeds incur surcharge'),
    (hp_plan_id, dim_cancer,   true,  0,    'Comprehensive cancer coverage'),
    (hp_plan_id, dim_diabetes, false, 0,    'Chronic pre-existing — not covered'),
    -- Trupanion
    (trup_plan_id, dim_pre,      false, 0,    'Excludes pre-existing; per-condition deductible'),
    (trup_plan_id, dim_hip,      true,  10,   'Covers hereditary if enrolled young'),
    (trup_plan_id, dim_allergy,  true,  0,    null),
    (trup_plan_id, dim_brachy,   true,  15,   null),
    (trup_plan_id, dim_cancer,   true,  0,    null),
    (trup_plan_id, dim_diabetes, false, 0,    null),
    -- Spot Pet
    (spot_plan_id, dim_pre,      true,  25,   'Covers curable pre-existing after 180-day waiting period'),
    (spot_plan_id, dim_hip,      true,  10,   null),
    (spot_plan_id, dim_allergy,  true,  5,    null),
    (spot_plan_id, dim_brachy,   true,  18,   null),
    (spot_plan_id, dim_cancer,   true,  0,    null),
    (spot_plan_id, dim_diabetes, false, 0,    null),
    -- Fetch Pet
    (fetch_plan_id, dim_pre,      false, 0,   null),
    (fetch_plan_id, dim_hip,      true,  12,  null),
    (fetch_plan_id, dim_allergy,  true,  5,   null),
    (fetch_plan_id, dim_brachy,   true,  20,  null),
    (fetch_plan_id, dim_cancer,   true,  0,   null),
    (fetch_plan_id, dim_diabetes, false, 0,   null),
    -- Figo Pet
    (figo_plan_id, dim_pre,      false, 0,    null),
    (figo_plan_id, dim_hip,      true,  15,   null),
    (figo_plan_id, dim_allergy,  true,  5,    null),
    (figo_plan_id, dim_brachy,   true,  20,   null),
    (figo_plan_id, dim_cancer,   true,  0,    null),
    (figo_plan_id, dim_diabetes, false, 0,    null),
    -- Embrace Pet
    (embr_plan_id, dim_pre,      true,  20,   'Covers curable pre-existing after 12-month waiting period'),
    (embr_plan_id, dim_hip,      true,  10,   null),
    (embr_plan_id, dim_allergy,  true,  5,    null),
    (embr_plan_id, dim_brachy,   true,  15,   null),
    (embr_plan_id, dim_cancer,   true,  0,    null),
    (embr_plan_id, dim_diabetes, false, 0,    null),
    -- ASPCA Pet
    (aspc_plan_id, dim_pre,      false, 0,    null),
    (aspc_plan_id, dim_hip,      true,  12,   null),
    (aspc_plan_id, dim_allergy,  true,  5,    null),
    (aspc_plan_id, dim_brachy,   true,  18,   null),
    (aspc_plan_id, dim_cancer,   true,  0,    null),
    (aspc_plan_id, dim_diabetes, false, 0,    null);
END $$;
