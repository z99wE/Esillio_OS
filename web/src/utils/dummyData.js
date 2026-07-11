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
