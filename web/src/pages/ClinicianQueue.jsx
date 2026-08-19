import React, { useState } from "react";
import client from "../api/client";
import GlassCard from "../components/GlassCard";

export default function ClinicianQueue() {
    const [patientId, setPatientId] = useState("");
    const [condition, setCondition] = useState("");
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await client.post("/education/generate", {
                patient_id: patientId,
                condition: condition,
                timeline_context: context
            });
            setResult(res.data.data);
            setCondition("");
            setContext("");
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight pb-2 leading-tight text-white">
                    Clinician <span className="font-primary italic drop-shadow-sm bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Queue</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Generate personalized, patient-friendly education cards for medical conditions based on timeline context.
                </p>
            </div>
            <GlassCard>
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary font-medium">Patient ID</label>
                        <input className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="Enter Patient UUID" value={patientId} onChange={e => setPatientId(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary font-medium">Condition</label>
                        <input className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-primary outline-none" placeholder="e.g. Type 2 Diabetes" value={condition} onChange={e => setCondition(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-secondary font-medium">Context / Patient History</label>
                        <textarea className="bg-black/40 border border-white/10 rounded-lg p-3 text-white h-32 focus:border-brand-primary outline-none" placeholder="Relevant timeline events or notes..." value={context} onChange={e => setContext(e.target.value)} />
                    </div>
                    <div className="pt-4 flex items-center gap-4">
                        <button onClick={handleGenerate} disabled={loading || !patientId || !condition} className="px-6 py-2 bg-brand-primary rounded-full text-white font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
                            {loading ? "Generating..." : "Generate Education Card"}
                        </button>
                    </div>
                    {error && <div className="text-red-400 mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
                    {result && <div className="text-green-400 mt-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">Successfully generated draft! ID: {result.id}</div>}
                </div>
            </GlassCard>
        </div>
    );
}
