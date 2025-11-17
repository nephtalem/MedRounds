-- ============================================
-- TEST PATIENTS DATA - Insert 12 Patients
-- ============================================
-- READY TO USE! 
-- Just copy this entire file and run it in Supabase SQL Editor
-- 
-- Round ID: 83842143-6819-4473-8dbc-ff476c6c9789
-- User ID: cab174da-1db0-424e-a522-8ed695ff916c
-- ============================================

-- Patient 1: Short content
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Ahmed Hassan (45/M)',
  'Type 2 Diabetes Mellitus',
  'Known diabetic for 5 years, poor glycemic control',
  'BP 140/90, BMI 32, foot pulses present',
  'HbA1c 9.2%, FBS 210 mg/dL',
  'Metformin 1000mg BD, Glimepiride 2mg OD',
  'Follow up in 2 weeks with lab results'
);

-- Patient 2: Medium content
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Fatima Mohammed (62/F)',
  'Hypertensive Heart Disease with Heart Failure (NYHA Class II)',
  'History of hypertension for 15 years, recent onset dyspnea on exertion. Complains of bilateral ankle swelling and orthopnea. No chest pain. Previous MI 3 years ago.',
  'BP 160/95 mmHg, HR 88/min irregular, bilateral pedal edema ++, JVP elevated, bibasal crepitations on chest auscultation, S3 gallop present',
  'ECG: Atrial fibrillation with controlled ventricular rate. Echo: EF 35%, LV systolic dysfunction, mild MR. NT-proBNP: 2500 pg/mL. Cr: 1.4 mg/dL',
  'Furosemide 40mg BD, Ramipril 5mg OD, Bisoprolol 5mg OD, Apixaban 5mg BD, Atorvastatin 40mg nocte. Advised salt restriction and fluid limitation to 1.5L/day',
  'Weekly follow-up for diuretic titration. Repeat echo in 3 months. Cardiology referral scheduled.'
);

-- Patient 3: Long diagnosis
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Sarah Abdullah (38/F)',
  'Systemic Lupus Erythematosus (SLE) with Lupus Nephritis Class IV, Secondary Antiphospholipid Syndrome, and Moderate Thrombocytopenia',
  'Diagnosed with SLE 6 years ago. Recent flare with increasing proteinuria and joint pains. History of deep vein thrombosis 2 years ago.',
  'Malar rash present, multiple joint swelling and tenderness (wrists, MCPs, knees). BP 145/92. No neurological deficits.',
  'ANA positive 1:640 speckled, Anti-dsDNA 250 IU/mL, C3 low, C4 low, 24h urine protein 3.5g. Platelets 85,000. Lupus anticoagulant positive.',
  'Prednisolone 60mg daily, Hydroxychloroquine 400mg daily, MMF 1g BD, Warfarin (target INR 2-3), Calcium and Vitamin D supplementation',
  'Rheumatology follow-up every 2 weeks. Repeat kidney biopsy if no improvement. Monitor CBC and renal function weekly.'
);

-- Patient 4: Long history
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Omar Khalil (55/M)',
  'Chronic Obstructive Pulmonary Disease (COPD) - GOLD Stage 3',
  'Heavy smoker for 35 years (50 pack-years), quit 6 months ago. Progressive dyspnea over the past 8 years with multiple exacerbations requiring hospitalization. Last admission 4 months ago for acute exacerbation. Chronic productive cough with whitish sputum. Recent episode of hemoptysis (small amount) prompted CT scan. History of pulmonary tuberculosis treated 20 years ago. No known drug allergies. Lives alone, limited exercise tolerance, uses stairs with difficulty. Previous occupation as construction worker. Family history of lung cancer in father.',
  'Thin built, respiratory rate 22/min, using accessory muscles. SpO2 89% on room air. Barrel chest deformity. Bilateral wheeze and reduced air entry on auscultation.',
  'Spirometry: FEV1 42% predicted, FEV1/FVC 0.58. ABG: pH 7.38, pCO2 52, pO2 65, HCO3 30. Chest X-ray: hyperinflation, flattened diaphragm. CT chest: emphysematous changes, no mass lesion.',
  'Tiotropium 18mcg daily, Salmeterol/Fluticasone 50/500 BD, PRN Salbutamol inhaler, Oxygen therapy (home oxygen 2L/min). Pulmonary rehabilitation referral.',
  'Monthly follow-up at pulmonary clinic. Annual spirometry. Pneumococcal and influenza vaccination scheduled. Smoking cessation support continuing.'
);

-- Patient 5: Long physical examination
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Layla Ibrahim (28/F)',
  'Hyperthyroidism - Graves Disease',
  'Presenting with weight loss of 8 kg over 3 months, palpitations, heat intolerance, and tremors. Family history of autoimmune thyroid disease.',
  'General: Anxious, hyperactive, excessive sweating. Vital signs: HR 110/min regular, BP 135/70. Thyroid: Diffusely enlarged thyroid gland (Grade 3 goiter), smooth, non-tender, bruit present on auscultation. Eyes: Bilateral exophthalmos, lid lag present, no diplopia, visual acuity normal, no optic neuropathy signs. Cardiovascular: Tachycardia, normal S1 S2, no murmurs. Respiratory: Clear. Neurological: Fine tremor of outstretched hands, brisk reflexes throughout (3+ in all deep tendon reflexes), proximal muscle weakness in shoulder girdle. Skin: Warm, moist, smooth. No pretibial myxedema noted.',
  'TSH <0.01 mIU/L, Free T4 4.8 ng/dL (elevated), Free T3 12.5 pg/mL (elevated). TSH receptor antibody positive. CBC normal. Thyroid ultrasound: diffusely enlarged, increased vascularity.',
  'Carbimazole 20mg TDS, Propranolol 40mg TDS for symptom control. Advised to avoid iodine-rich foods.',
  'Endocrinology follow-up in 4 weeks with repeat TFTs. Ophthalmology review for thyroid eye disease monitoring. Discussed radioiodine therapy option.'
);

-- Patient 6: Long lab investigations
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Youssef Ali (48/M)',
  'Newly Diagnosed Chronic Kidney Disease Stage 4',
  'Incidental finding during routine checkup. Mild fatigue and decreased appetite for past 2 months. History of poorly controlled hypertension.',
  'BP 165/98, pallor present, mild pedal edema. Cardiovascular and respiratory examination unremarkable.',
  'Creatinine 4.2 mg/dL (previous 1.3 mg/dL 2 years ago), eGFR 18 mL/min/1.73m². Urea 125 mg/dL. Sodium 138, Potassium 5.6 mEq/L, Bicarbonate 18 mEq/L. Hemoglobin 9.2 g/dL (normocytic normochromic anemia). Calcium 7.8 mg/dL, Phosphate 5.8 mg/dL, PTH 285 pg/mL (elevated). Urinalysis: Protein 3+, RBCs 10-15/hpf, no casts. 24-hour urine protein 2.8 g. Ultrasound kidneys: bilateral reduced size (right 8.2 cm, left 8.5 cm), increased echogenicity, poor corticomedullary differentiation, no hydronephrosis. ANA negative, C3 C4 normal. Hepatitis B and C screening negative.',
  'Amlodipine 10mg OD, Losartan 100mg OD, Furosemide 40mg OD. Sodium bicarbonate 1g TDS. Iron sucrose IV infusion. Calcium carbonate 500mg TDS with meals. Vitamin D3 supplementation.',
  'Nephrology referral urgent for dialysis planning. Repeat labs in 1 week. Dietitian consultation for low-protein, low-potassium diet. AV fistula creation discussion. Patient education regarding kidney disease and treatment options including dialysis and transplantation.'
);

-- Patient 7: Long treatment
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Amira Hassan (71/F)',
  'Multiple Comorbidities: Ischemic Heart Disease Post-CABG, Type 2 DM, CKD Stage 3b, Osteoarthritis',
  'Complex medical history with CABG 5 years ago, stable angina controlled with medications. Diabetic for 20 years with retinopathy and nephropathy.',
  'Elderly lady, well oriented. BP 138/82, HR 68 regular. Midline sternotomy scar. Bilateral knee crepitus and mild effusion. Diminished foot sensation.',
  'HbA1c 7.8%, Creatinine 1.8 mg/dL, eGFR 32. LDL 85 mg/dL. ECG: old inferior MI, no acute changes. Recent echo: EF 45%, mild LV dysfunction.',
  'Cardiovascular: Aspirin 75mg OD, Clopidogrel 75mg OD (completed 1 year post-PCI), Bisoprolol 5mg OD, Ramipril 5mg OD, Atorvastatin 80mg nocte, Isosorbide mononitrate 60mg SR OD. Diabetes: Metformin 500mg BD (reduced dose due to CKD), Insulin Glargine 20 units nocte, Insulin Aspart 8 units before meals. Pain management: Paracetamol 1g TDS PRN, Tramadol 50mg BD PRN (avoid NSAIDs due to CKD). Gastric protection: Pantoprazole 40mg OD. Supplements: Calcium with Vitamin D3 daily. Advised home blood glucose monitoring and BP monitoring.',
  'Cardiology follow-up every 3 months. Diabetic retinopathy screening due. Nephrology review in 6 months. Orthopedic consultation for knee replacement consideration. Medication review and reconciliation done. Discussed advance care planning and goals of care.'
);

-- Patient 8: Long follow-up
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Khalid Mohammed (42/M)',
  'Newly Diagnosed Pulmonary Tuberculosis with Cavitation',
  'Chronic cough for 3 months, significant weight loss (12 kg), night sweats, hemoptysis. HIV test negative. No previous TB history.',
  'Thin, febrile (38.5°C), respiratory rate 24/min. Reduced air entry and crepitations in right upper zone. No lymphadenopathy.',
  'Sputum AFB positive (3+), GeneXpert MTB detected, Rifampicin sensitive. Chest X-ray: right upper lobe cavitation with surrounding infiltrate. CBC: mild anemia.',
  'Intensive phase (2 months): HRZE - Isoniazid 300mg, Rifampicin 600mg, Pyrazinamide 1500mg, Ethambutol 1200mg daily. Pyridoxine 25mg daily to prevent INH neuropathy.',
  'Weekly follow-up for first month to monitor treatment adherence and side effects (hepatotoxicity monitoring with LFTs, visual acuity checks for ethambutol). Sputum AFB repeat at end of intensive phase (2 months) and at 5 months. Contact tracing initiated for household members - TB screening arranged. After intensive phase, continue with continuation phase (4 months) with HR only. Patient education provided regarding medication compliance, infectivity precautions, and importance of completing full 6-month course. Social support arranged through TB control program. Directly observed therapy (DOT) initiated through community health worker. Chest X-ray repeat at 2 months and 6 months to assess treatment response. Nutritional support and counseling provided. Return to work clearance after completing intensive phase and sputum conversion documented.'
);

-- Patient 9: Mixed long content
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Noor Ahmed (34/F)',
  'Severe Iron Deficiency Anemia secondary to Menorrhagia - Under Investigation',
  'Chronic heavy menstrual bleeding for 2 years, progressively worsening. Recent episodes of syncope. Extreme fatigue limiting daily activities. No GI bleeding symptoms. Previous treatment with oral iron showed minimal improvement due to poor tolerance and compliance. Nulliparous, planning pregnancy. Significant impact on quality of life and work performance as teacher.',
  'Pale, tachycardic (HR 108), BP 100/65 (orthostatic drop present). Systolic flow murmur. Per abdominal: soft, no masses. No hepatosplenomegaly.',
  'Hemoglobin 6.2 g/dL (severe), MCV 62 fL, MCH 19 pg (microcytic hypochromic). Ferritin 4 ng/mL (very low), TIBC elevated, transferrin saturation 5%. Peripheral smear: microcytic hypochromic RBCs, anisocytosis, pencil cells. Reticulocyte count 0.8% (inappropriately low). Upper GI endoscopy: normal. Colonoscopy: normal. Pelvic ultrasound: bulky uterus with multiple intramural fibroids (largest 4.5 cm), endometrial thickness 14mm.',
  'IV iron sucrose infusion course (total iron deficit calculation: 1200mg) - 200mg infusion twice weekly for 3 weeks. Blood transfusion 2 units PRBC given (post-transfusion Hb 8.1 g/dL). Tranexamic acid 1g TDS during menses. Combined oral contraceptive started for menorrhagia control. Follow-up with gynecology scheduled.',
  'CBC repeat after completing iron infusion course (4 weeks). Reticulocyte count at 1 week to confirm bone marrow response. Gynecology review scheduled in 2 weeks for discussion of definitive management options (myomectomy vs uterine artery embolization vs hormonal IUD). Dietitian referral for nutritional counseling. If planning pregnancy, hematology and high-risk obstetrics consultation recommended. Long-term plan: achieve target Hb >12 g/dL and ferritin >100 ng/mL before considering pregnancy. Patient education regarding iron-rich foods and optimization strategies.'
);

-- Patient 10: Very long diagnosis and history
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Hassan Mahmoud (67/M)',
  'Metastatic Adenocarcinoma of the Lung (Stage IV) with Brain, Bone, and Liver Metastases, Performance Status ECOG 2',
  'Lifelong smoker (60 pack-years), presented 3 months ago with persistent cough, weight loss (15 kg over 4 months), and right-sided chest pain. Initial workup revealed large right hilar mass with mediastinal lymphadenopathy. Biopsy confirmed adenocarcinoma, ALK and EGFR negative, PD-L1 expression 65%. Staging scans showed multiple brain metastases (largest in right frontal lobe 2.3 cm), multiple bone metastases (spine, pelvis, ribs), and liver metastases. Completed whole brain radiotherapy 6 weeks ago with partial neurological symptom improvement. Started first-line chemotherapy (Carboplatin/Pemetrexed) 4 weeks ago, completed 2 cycles. Recent admission for febrile neutropenia post-chemotherapy, treated with broad-spectrum antibiotics. Bone pain managed with radiotherapy to L3 vertebra. Patient and family informed of poor prognosis, palliative intent of treatment discussed.',
  'Cachectic, ECOG performance status 2. Conscious, oriented. Right-sided Horner syndrome. Reduced air entry right lung. Tender over L3 spine. Hepatomegaly 4cm below costal margin.',
  'Recent CT chest/abdomen/pelvis: stable primary tumor, mixed response in liver metastases. Brain MRI: stable post-radiation changes. Hemoglobin 9.8 g/dL, platelets 180,000, ANC 2500 (recovered). Tumor markers: CEA 245 ng/mL.',
  'Chemotherapy: Continue Carboplatin AUC 5 + Pemetrexed 500mg/m² every 3 weeks (cycle 3 due next week). Supportive: Folic acid, Vitamin B12, Dexamethasone premedication. Pain: Morphine SR 60mg BD, Morphine IR 10mg Q4H PRN. Bone protection: Denosumab 120mg SC monthly. Antiemetics: Ondansetron PRN.',
  'Oncology review before each chemotherapy cycle. Response assessment with CT after cycle 4 (6 weeks). Palliative care team involvement for symptom management and advance care planning. Social worker support for patient and family. Reassess treatment continuation based on response and tolerability. Brain MRI in 2 months. Discussed clinical trial options if progression occurs. Regular pain assessment and medication adjustment as needed.'
);

-- Patient 11: Multiple systems involvement
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Mariam Said (52/F)',
  'Rheumatoid Arthritis (Seropositive, Severe) with Multiple Joint Erosions and Extra-articular Manifestations',
  'Diagnosed 15 years ago, progressive disease despite multiple DMARDs. Recent flare with increasing pain and stiffness. Morning stiffness lasting >2 hours. History of rheumatoid nodules, secondary Sjogren syndrome with dry eyes and mouth. Previous treatments: MTX (stopped due to hepatotoxicity), Leflunomide (inadequate response), currently on Hydroxychloroquine and Sulfasalazine with poor control.',
  'Multiple joint deformities: ulnar deviation of fingers, swan neck deformities, Z-thumb deformity, subluxation of MCPs. Bilateral knee effusions. Rheumatoid nodules on elbows. Reduced range of motion in shoulders and hips. DAS28 score: 6.8 (high disease activity).',
  'RF positive 385 IU/mL, Anti-CCP >300 U/mL, ESR 68 mm/hr, CRP 45 mg/L. X-rays: erosive changes in hands and feet, joint space narrowing. MRI wrists: active synovitis with bone marrow edema. Normal renal and liver function.',
  'Starting biologic therapy: Adalimumab 40mg SC every 2 weeks. Continue Hydroxychloroquine 400mg daily, Sulfasalazine 2g daily. Prednisolone 10mg daily (taper planned). MTX reintroduction considered if LFTs normalize. Folic acid 5mg weekly. Calcium/Vitamin D. Analgesics: Paracetamol, Tramadol PRN.',
  'Rheumatology follow-up every 4 weeks initially to assess biologic response. Target: DAS28 <3.2 within 6 months. TB screening done prior to biologic (negative). Repeat inflammatory markers monthly. Hand surgeon referral for possible future reconstructive surgery. Occupational therapy assessment for joint protection techniques and assistive devices. Ophthalmology for Sjogren monitoring. Vaccination update (influenza, pneumococcal) completed before biologic initiation. Patient education on biologic therapy, infection risk, and when to seek medical attention.'
);

-- Patient 12: Comprehensive case
INSERT INTO patients (round_id, user_id, name, diagnosis, brief_history, physical_examination, lab_result, medications, plan)
VALUES (
  '83842143-6819-4473-8dbc-ff476c6c9789',
  'cab174da-1db0-424e-a522-8ed695ff916c',
  'Ibrahim Abdullah (58/M)',
  'Decompensated Liver Cirrhosis (Child-Pugh Class C) secondary to Chronic Hepatitis C, complicated by Ascites, Hepatic Encephalopathy, and Portal Hypertension',
  'Known case of HCV-related cirrhosis diagnosed 8 years ago. Previous antiviral treatment (Interferon-based) failed. Recent decompensation with development of ascites 6 months ago, requiring multiple paracentesis procedures. Two episodes of hepatic encephalopathy in past 3 months. History of esophageal varices (Grade 2) on last endoscopy 1 year ago, no bleeding history. Denied alcohol use. Increasing abdominal distension, decreased appetite, and confusion episodes. Family history of hepatocellular carcinoma in brother. Patient listed for liver transplant evaluation but complicated by significant comorbidities.',
  'Jaundiced, confused (Grade 2 encephalopathy), asterixis present. Marked ascites with shifting dullness and fluid thrill. Spider nevi on chest, palmar erythema, muscle wasting. Splenomegaly palpable. No peripheral edema currently. Abdominal wall collateral veins visible (caput medusae). Temperature 37.8°C. No signs of SBP currently.',
  'Total bilirubin 5.8 mg/dL (conjugated 4.2), Albumin 2.3 g/dL, INR 2.1, Platelets 65,000. AST 120, ALT 85, ALP 180. Creatinine 1.6 mg/dL, Sodium 128 mEq/L. Ammonia 95 mcg/dL (elevated). Child-Pugh score 12 (Class C), MELD score 22. HCV RNA still detectable. AFP 125 ng/mL (concerning for HCC). Recent ascitic fluid analysis: SAAG >1.1, no evidence of SBP (WBC 180, PMN 15%). Abdominal ultrasound with Doppler: cirrhotic liver, patent portal vein, splenomegaly, large volume ascites. Upper GI endoscopy scheduled.',
  'Diuretics: Spironolactone 200mg daily, Furosemide 80mg daily (careful monitoring of renal function and electrolytes). Lactulose 30ml TDS titrated to 2-3 soft stools daily. Rifaximin 550mg BD for encephalopathy prevention. Propranolol 20mg BD (for variceal prophylaxis, pending endoscopy results). Nutritional support: high-calorie, high-protein diet (1.2-1.5 g/kg), small frequent meals, late-evening snack. Vitamin supplementation: Thiamine, Folate, Multivitamin. Sodium restriction <2g/day, fluid restriction <1.5L/day. Avoid hepatotoxic medications and NSAIDs. Proton pump inhibitor: Pantoprazole 40mg daily. Treatment for HCV with DAA regimen planned after stabilization: Sofosbuvir/Velpatasvir for 12 weeks.',
  'Close monitoring in hepatology clinic every 1-2 weeks. Daily weights and abdominal girth measurements at home. Repeat labs (CBC, liver panel, renal function, electrolytes) weekly initially. Large volume paracentesis planned if symptomatic despite diuretics (with albumin replacement). Upper GI endoscopy for variceal assessment scheduled in 1 week - may require variceal band ligation. Repeat AFP and liver imaging (triphasic CT or MRI) in 6 weeks for HCC surveillance given elevated AFP. Liver transplant evaluation to continue - requires infectious disease clearance, cardiac clearance, psychological evaluation. SBP prophylaxis consideration (Norfloxacin) if ascitic protein <1.5 g/dL. Hepatology nurse education on signs of encephalopathy, SBP, variceal bleeding. Nutritionist follow-up for dietary counseling. Social work involvement for transplant financial counseling and caregiver support. Palliative care consultation recommended for advance care planning given poor prognosis. Family meeting scheduled to discuss transplant options, prognosis, and treatment goals.'
);

-- ============================================
-- NOTES:
-- ✅ IDs are already configured and ready to use!
-- ✅ Column names match your database schema
-- - These patients have varied content lengths to test table wrapping
-- - Data is realistic for medical scenarios
-- - You can run this script multiple times for different rounds by changing the round_id
-- ============================================
