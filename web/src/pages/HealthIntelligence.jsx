import React, { useState, useEffect } from "react";
import useUpload from "../hooks/useUpload";
import { useHealth } from "../context/HealthContext";
import { dummyPatients } from "../utils/dummyData";
import GlassCard from "../components/GlassCard";
import ClinicianSummary from "../components/ClinicianSummary";
import client from "../api/client";

// Helper: render any string or array field as readable text
function renderField(value) {
    if (!value) return null;
    if (Array.isArray(value)) {
        if (value.length === 0) return null;
        return value.map((v, i) => (
            <span key={i} className="inline-block mr-2 mb-1 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-sm text-text-secondary">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </span>
        ));
    }
    return <span className="text-text-secondary text-sm leading-relaxed">{String(value)}</span>;
}

// Section card for AI pipeline output
function IntelligenceSection({ title, data }) {
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) return null;

    const entries = typeof data === "string"
        ? [["Response", data]]
        : Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));

    if (entries.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-primary/80">{title}</h3>
            <div className="flex flex-col gap-3">
                {entries.map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-text/50 font-medium">
                            {key.replace(/_/g, " ")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                            {renderField(value)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function HealthIntelligence() {
    const uploadContext = useUpload();
    const { currentPatientId, setCurrentPatientId } = useHealth();
    const [aiStatus, setAiStatus] = useState(null); // { ai_ready, provider }
    const [clinicianData, setClinicianData] = useState(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        try {
            const res = await client.get("/api/export/clinician");
            setClinicianData(res.data);
            setTimeout(() => {
                window.print();
            }, 500);
        } catch (error) {
            console.error("Failed to generate summary:", error);
            // Fallback for demo mode if backend is not running
            alert("Could not fetch from backend. Ensure FastAPI is running.");
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    const selectedPatient = React.useMemo(
        () => dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0],
        [currentPatientId]
    );

    // Check AI provider health on mount
    useEffect(() => {
        client.get("/esiwell/health")
            .then(res => setAiStatus(res.data))
            .catch(() => setAiStatus({ ai_ready: false, provider: "offline" }));
    }, []);

    // Merge real upload data with patient-specific demo fallbacks
    const upload = React.useMemo(() => {
        if (uploadContext?.status === "success") return uploadContext;
        // Demo fallback
        return {
            document: { filename: `${selectedPatient.name.replace(" ", "_")}_Records.pdf` },
            timeline: {
                events_created: selectedPatient.intelligenceStats?.eventsExtracted || 0,
                events: selectedPatient.timeline || []
            },
            clinical_intelligence: {
                medical_extraction: {
                    conditions: selectedPatient.conditions || [],
                    medications: selectedPatient.medications || [],
                    symptoms: selectedPatient.keyFindings || [],
                    summary: selectedPatient.summary || "",
                },
                wellness: {
                    nutrition: selectedPatient.wellnessInsights?.[0] || "",
                    exercise: selectedPatient.wellnessInsights?.[1] || "",
                    sleep: selectedPatient.wellnessInsights?.[2] || "",
                },
                guardian: {
                    status: selectedPatient.intelligenceStats?.guardianStatus || "Complete",
                    priority_findings: selectedPatient.keyFindings?.slice(0, 2) || [],
                },
                clinical_memory: { updated: true },
                pipeline_status: selectedPatient.intelligenceStats?.pipelineStatus || "complete",
                errors: [],
            },
            status: "demo",
        };
    }, [uploadContext, selectedPatient]);

    const timeline = upload.timeline || {};
    const intelligence = upload.clinical_intelligence || {};
    const extraction = intelligence.medical_extraction || {};
    const wellness = intelligence.wellness || {};
    const guardian = intelligence.guardian || {};
    const pipelineStatus = intelligence.pipeline_status || upload.status || "complete";

    return (
        <>
        <div className="w-full max-w-6xl mx-auto py-16 px-4 relative z-10 print:hidden">
            <div className="text-center mb-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                    Your health story is <span className="font-primary italic drop-shadow-sm">taking shape</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Esillio has processed your records and updated your clinical memory.
                </p>

                <button 
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50"
                >
                    {isGeneratingSummary ? "Generating..." : "Generate Clinician Summary"}
                </button>

                {/* AI Provider status badge */}
                {aiStatus && (
                    <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border ${
                        aiStatus.ai_ready
                            ? "border-green-500/30 bg-green-900/20 text-green-300"
                            : "border-white/10 bg-white/5 text-text-secondary"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${aiStatus.ai_ready ? "bg-green-400" : "bg-white/30"}`} />
                        {aiStatus.ai_ready
                            ? `AI Connected — ${aiStatus.provider?.replace("Provider", "").replace("_", "")}`
                            : "Demo Mode — Add API key in Settings for full AI"}
                    </div>
                )}
            </div>

            {/* Patient Selector */}
            <div className="flex flex-wrap justify-center gap-6 mb-16 overflow-x-auto pb-4 max-w-full">
                {dummyPatients.map((p) => {
                    const isActive = currentPatientId === p.id;
                    return (
                        <div
                            key={p.id}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isActive}
                            onClick={() => setCurrentPatientId(p.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    setCurrentPatientId(p.id);
                                }
                            }}
                            className={`shrink-0 p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-2xl group relative cursor-pointer snap-start transition-all duration-300 ${
                                isActive ? "scale-105 z-10" : "hover:-translate-y-1"
                            }`}
                        >
                            <div className={`absolute inset-0 blur-xl transition-opacity duration-500 pointer-events-none rounded-2xl ${
                                isActive ? "bg-brand-primary/20 opacity-100" : "bg-brand-primary/10 opacity-0 group-hover:opacity-100"
                            }`} />
                            <div className={`h-full bg-background/40 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border relative overflow-hidden transition-all duration-300 ${
                                isActive
                                    ? "border-brand-primary/30 bg-white/5 shadow-[0_0_20px_rgba(255,69,51,0.2)]"
                                    : "border-white/5 group-hover:bg-white/5 group-hover:border-white/10"
                            }`}>
                                <p className="font-primary whitespace-nowrap">
                                    <span className={`font-semibold transition-colors ${isActive ? "text-text" : "text-text/80 group-hover:text-text"}`}>
                                        {p.name}
                                    </span>
                                    <span className={`text-xs ml-2 transition-colors ${isActive ? "text-text/70" : "text-text/50 group-hover:text-text/70"}`}>
                                        ({p.subtitle.split(" ")[0]})
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Document</h3>
                    <h2 className="text-xl font-medium text-text truncate" title={upload.document?.filename || "Medical Record"}>
                        {upload.document?.filename || "Medical Record"}
                    </h2>
                    <p className="text-sm text-accent font-medium mt-auto pt-4">Successfully processed</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Timeline Events</h3>
                    <h2 className="text-4xl font-medium text-text">{timeline.events_created ?? 0}</h2>
                    <p className="text-sm text-text/70 mt-auto pt-4">Clinical events extracted</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Pipeline</h3>
                    <h2 className="text-xl font-medium text-text capitalize">
                        {pipelineStatus.replace(/_/g, " ")}
                    </h2>
                    <p className="text-sm text-text/70 mt-auto pt-4">AI processing status</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Guardian</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-3 h-3 rounded-full ${guardian.status ? "bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]" : "bg-white/5 border border-white/10"}`} />
                        <h2 className="text-lg font-medium text-text">
                            {guardian.status || "Pending"}
                        </h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Clinical safety review</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Clinical Memory</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-3 h-3 rounded-full ${intelligence.clinical_memory ? "bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]" : "bg-white/5 border border-white/10"}`} />
                        <h2 className="text-lg font-medium text-text">
                            {intelligence.clinical_memory ? "Updated" : "Pending"}
                        </h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Longitudinal state</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">EsiWell</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]" />
                        <h2 className="text-lg font-medium text-text">Active</h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Knowledge layer</p>
                </GlassCard>
            </div>

            {/* AI PIPELINE OUTPUT — the actual clinical intelligence results */}
            {(extraction.summary || extraction.conditions?.length > 0 || wellness.nutrition || guardian.priority_findings?.length > 0) && (
                <div className="p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-3xl w-full mb-12">
                    <div className="bg-background/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
                        <h2 className="text-2xl font-medium text-text mb-2">Clinical Intelligence Output</h2>
                        <p className="text-sm text-text-secondary mb-8">
                            {upload.status === "demo"
                                ? "Demo data for this patient. Upload a real document to see AI-extracted results."
                                : "Extracted from your uploaded document by the Esillio AI pipeline."}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <IntelligenceSection title="Medical Extraction" data={extraction} />
                            <IntelligenceSection title="Wellness Guidance" data={wellness} />
                            <IntelligenceSection title="Guardian Review" data={guardian} />
                            {intelligence.esiwell && (
                                <IntelligenceSection title="EsiWell" data={intelligence.esiwell} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TIMELINE PREVIEW */}
            {timeline.events && timeline.events.length > 0 && (
                <div className="p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-3xl w-full">
                    <div className="bg-background/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
                        <h2 className="text-2xl font-medium text-text mb-8 border-b border-white/10 pb-4">
                            Recent Discoveries
                        </h2>
                        <div className="space-y-4">
                            {timeline.events.map((event, index) => (
                                <div key={event.id || index} className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/10 to-accent/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <strong className="text-text font-medium">{event.title}</strong>
                                            <span className="text-sm text-text/70">{event.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* PRINT ONLY SECTION */}
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999] min-h-screen">
            {clinicianData && <ClinicianSummary data={clinicianData} />}
        </div>
        </>
    );
}