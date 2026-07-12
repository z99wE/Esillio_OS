export const dummyPatients = [
    {
        id: "usr-demo-1",
        name: "Alex Demo",
        subtitle: "Diabetic Management",
        age: 34,
        bloodType: "O+",
        allergies: ["Penicillin", "Peanuts"],
        chronicConditions: ["Borderline Insulin Resistance"],
        lastUpdated: "2026-07-10T14:30:00Z",
        intelligenceStats: { eventsExtracted: 12, pipelineStatus: "Active", guardianStatus: "Monitoring" },
        timeline: [
            {
                id: "evt-001",
                title: "Hemoglobin A1C Check",
                date: "2026-06-15",
                category: "Biomarker",
                description: "Routine blood work indicates an HbA1c level of 5.6%, which is within the normal range. The next check is scheduled in 12 months.",
                confidence: 0.98,
                tags: ["Blood Test", "Routine"]
            },
            {
                id: "evt-002",
                title: "Metformin Prescription Refill",
                date: "2026-05-10",
                category: "Medication",
                description: "Dr. Smith authorized a 90-day refill of Metformin (500mg) for management of borderline insulin resistance.",
                confidence: 0.95,
                tags: ["Prescription", "Endocrinology"]
            },
            {
                id: "evt-003",
                title: "Migraine Headache Episode",
                date: "2026-03-22",
                category: "Symptom",
                description: "Patient reported a severe migraine lasting approximately 6 hours, accompanied by photophobia and nausea. Relieved by Ibuprofen.",
                confidence: 0.88,
                tags: ["Neurology", "Acute"]
            },
            {
                id: "evt-004",
                title: "Annual Physical Exam",
                date: "2026-01-14",
                category: "Clinical Event",
                description: "Comprehensive physical examination completed. Vitals stable. Discussed dietary improvements and sleep hygiene.",
                confidence: 0.99,
                tags: ["General Practice", "Checkup"]
            }
        ]
    },
    {
        id: "usr-demo-2",
        name: "Sarah Jenkins",
        subtitle: "Cardiac Recovery",
        age: 58,
        bloodType: "A-",
        allergies: ["Sulfa Drugs"],
        chronicConditions: ["Hypertension", "Post-Myocardial Infarction"],
        lastUpdated: "2026-07-12T09:15:00Z",
        intelligenceStats: { eventsExtracted: 45, pipelineStatus: "Analyzing", guardianStatus: "High Alert" },
        timeline: [
            {
                id: "evt-101",
                title: "Echocardiogram Follow-up",
                date: "2026-07-01",
                category: "Imaging",
                description: "LVEF improved to 45%. No new wall motion abnormalities. Continue current beta-blocker regimen.",
                confidence: 0.99,
                tags: ["Cardiology", "Imaging"]
            },
            {
                id: "evt-102",
                title: "Cardiology Consult",
                date: "2026-06-05",
                category: "Clinical Event",
                description: "Patient reports mild exertional dyspnea. Adjusted medication dosage. Scheduled stress test.",
                confidence: 0.95,
                tags: ["Consultation", "Cardiology"]
            },
            {
                id: "evt-103",
                title: "Prescription: Atorvastatin",
                date: "2026-06-05",
                category: "Medication",
                description: "Started Atorvastatin 40mg daily for lipid management post-MI.",
                confidence: 0.97,
                tags: ["Prescription", "Cardiology"]
            }
        ]
    },
    {
        id: "usr-demo-3",
        name: "Marcus Chen",
        subtitle: "Healthy / Preventive",
        age: 28,
        bloodType: "B+",
        allergies: ["None"],
        chronicConditions: ["None"],
        lastUpdated: "2026-07-05T11:20:00Z",
        intelligenceStats: { eventsExtracted: 5, pipelineStatus: "Idle", guardianStatus: "Optimal" },
        timeline: [
            {
                id: "evt-201",
                title: "Routine Sports Physical",
                date: "2026-05-20",
                category: "Clinical Event",
                description: "Cleared for marathon training. Excellent cardiovascular fitness.",
                confidence: 0.99,
                tags: ["Checkup", "Sports Medicine"]
            },
            {
                id: "evt-202",
                title: "Basic Metabolic Panel",
                date: "2026-05-18",
                category: "Biomarker",
                description: "All values within normal limits. Fasting glucose at 85 mg/dL.",
                confidence: 0.98,
                tags: ["Blood Test", "Routine"]
            }
        ]
    },
    {
        id: "usr-demo-4",
        name: "Elena Rodriguez",
        subtitle: "Oncology Remission",
        age: 45,
        bloodType: "AB+",
        allergies: ["Latex"],
        chronicConditions: ["Breast Cancer (Remission)"],
        lastUpdated: "2026-07-11T16:00:00Z",
        intelligenceStats: { eventsExtracted: 112, pipelineStatus: "Active", guardianStatus: "Monitoring" },
        timeline: []
    },
    {
        id: "usr-demo-5",
        name: "David Kim",
        subtitle: "Post-Op Rehab",
        age: 62,
        bloodType: "O-",
        allergies: ["Aspirin"],
        chronicConditions: ["Osteoarthritis"],
        lastUpdated: "2026-07-08T10:45:00Z",
        intelligenceStats: { eventsExtracted: 28, pipelineStatus: "Idle", guardianStatus: "Stable" },
        timeline: []
    }
];

export const dummyTimeline = dummyPatients[0].timeline;
export const dummyMemory = dummyPatients[0];

export const esiwellPrompts = [
    { id: 1, title: "A1C Trend", text: "What does my latest A1C mean for my prediabetes?" },
    { id: 2, title: "Cardiac History", text: "Summarize my cardiac history for a new specialist." },
    { id: 3, title: "Drug Interactions", text: "Are there any interactions in my current medication list?" },
    { id: 4, title: "Upcoming Tests", text: "Based on my history, what preventive screenings am I due for?" },
    { id: 5, title: "Symptom Check", text: "I've had a headache for 2 days. How does this compare to my past migraines?" },
    { id: 6, title: "Dietary Changes", text: "What dietary changes should I make based on my recent lipid panel?" },
    { id: 7, title: "Blood Pressure", text: "Are my recent blood pressure readings trending in the right direction?" },
    { id: 8, title: "Vaccination Record", text: "When was my last tetanus shot?" },
    { id: 9, title: "Post-Op Recovery", text: "Is my current knee mobility normal for 4 weeks post-surgery?" },
    { id: 10, title: "Allergy Alert", text: "I was prescribed Amoxicillin. Does this conflict with my Penicillin allergy?" }
];

export const demoFiles = [
    { id: "file-1", name: "Routine_Bloodwork_June2026.pdf", type: "PDF", size: "2.4 MB" },
    { id: "file-2", name: "MRI_Brain_Scan_Report.pdf", type: "PDF", size: "8.1 MB" },
    { id: "file-3", name: "Cardiology_Consult_Summary.docx", type: "DOCX", size: "1.2 MB" }
];

// Per-patient multi-agent wellness responses (for demo mode)
export const esiwellAgentResponses = {
    "usr-demo-1": {
        // Alex Demo — Borderline Insulin Resistance, Metformin, Migraines
        EsiDiet: "Given your borderline insulin resistance and Metformin use, I recommend a low-glycaemic diet rich in fibre: think lentils, leafy greens, and whole grains paired with small, frequent meals to keep your blood glucose stable.",
        EsiActive: "Your last annual exam flagged dietary and sleep improvements as priorities — a 20-minute post-meal walk daily is one of the most effective evidence-based interventions for insulin sensitivity; start there before adding resistance training.",
        EsiCalm: "Migraine frequency is closely linked to sleep quality and blood sugar swings; a consistent bedtime routine with no screens 30 minutes before sleep and a small protein-rich snack can help prevent late-night glucose dips that trigger your episodes."
    },
    "usr-demo-2": {
        // Sarah Jenkins — Post-MI, Hypertension, Atorvastatin, Dyspnea on exertion
        EsiDiet: "Post-MI recovery calls for a strict heart-healthy diet: the DASH or Mediterranean approach with minimal sodium (under 1,500 mg/day), plenty of omega-3s from fatty fish, and avoiding saturated fats to complement your Atorvastatin therapy.",
        EsiActive: "Given your recent exertional dyspnea and improved LVEF of 45%, any new exercise must be cleared by your cardiologist first — until your stress test, stick to supervised cardiac rehabilitation sessions at low intensity.",
        EsiCalm: "Cardiac recovery carries significant psychological weight; guided breathing or body-scan meditations for 10 minutes each morning can lower cortisol and systolic blood pressure, which is especially important given your hypertension."
    },
    "usr-demo-3": {
        // Marcus Chen — Healthy, marathon training, excellent fitness
        EsiDiet: "With your fasting glucose at a healthy 85 mg/dL and marathon training cleared, fuel your training with a 60% complex carbohydrate diet — prioritise carb-loading 24 hours before long runs and replenish with electrolytes post-workout.",
        EsiActive: "Your sports physical gave you an all-clear — follow an 18-week periodised marathon plan that builds weekly mileage by no more than 10% and includes at least one full rest day to prevent overuse injuries.",
        EsiCalm: "At peak training loads, mental recovery is as important as physical rest; incorporate one mindful active-rest day per week (yoga, hiking, gentle swimming) to keep motivation high and prevent burnout."
    },
    "usr-demo-4": {
        // Elena Rodriguez — Breast Cancer Remission, Latex allergy
        EsiDiet: "In cancer remission, an anti-inflammatory diet is essential: emphasise colourful vegetables, berries, turmeric, and cruciferous vegetables like broccoli, while minimising processed foods and alcohol which are known to elevate cancer recurrence risk.",
        EsiActive: "Gentle, consistent movement is well-evidenced for reducing recurrence risk in breast cancer survivors — 150 minutes of moderate-intensity aerobic activity per week (walking, cycling, swimming) is the current oncology guideline.",
        EsiCalm: "Survivorship anxiety is common and valid; structured mindfulness-based stress reduction (MBSR) programmes have the strongest evidence for improving quality of life in cancer survivors and may be available through your oncology centre."
    },
    "usr-demo-5": {
        // David Kim — Osteoarthritis, Post-Op Rehab, Aspirin allergy
        EsiDiet: "For osteoarthritis management, emphasise omega-3 fatty acids (salmon, walnuts, flaxseed), vitamin D and calcium-rich foods to support bone density, and avoid high-purine foods that can worsen joint inflammation.",
        EsiActive: "Post-op knee rehabilitation should follow your physiotherapist's protocol strictly — prioritise range-of-motion exercises in the first 4 weeks, then progress to closed-chain exercises like mini-squats once cleared; avoid high-impact activity until 12 weeks post-surgery.",
        EsiCalm: "Chronic pain from osteoarthritis significantly affects mood and sleep; a pain management mindfulness practice combined with heat therapy before bed can improve both sleep quality and your perception of pain levels."
    }
};
