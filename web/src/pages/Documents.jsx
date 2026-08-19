import React, { useState, useEffect } from "react";
import { useHealth } from "../context/HealthContext";
import client from "../api/client";
import GlassCard from "../components/GlassCard";

export default function Documents() {
    const { timeline, currentPatientId } = useHealth();
    
    // Extract unique document IDs from timeline events
    const availableDocs = Array.from(new Set(
        timeline
            .map(e => e.document_id)
            .filter(id => id !== null && id !== undefined)
    ));

    const [docA, setDocA] = useState("");
    const [docB, setDocB] = useState("");
    const [diffData, setDiffData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCompare = async () => {
        if (!docA || !docB) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const res = await client.get(`/timeline/diff?doc_a_id=${docA}&doc_b_id=${docB}`);
            setDiffData(res.data.data);
        } catch (err) {
            console.error("Failed to compare encounters:", err);
            setError(err.response?.data?.detail || "Failed to analyze differences between encounters.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight pb-2 leading-tight text-white">
                    Documents & <span className="font-primary italic drop-shadow-sm bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Encounters</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Select two uploaded medical records or encounter summaries to analyze semantic clinical differences over time.
                </p>
            </div>

            <GlassCard>
                <div className="p-2 overflow-y-auto flex-1 flex flex-col gap-6">
                    {/* Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-xl border border-white/10">
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-text-secondary">Encounter A (Older)</label>
                            <select 
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                value={docA}
                                onChange={(e) => setDocA(e.target.value)}
                            >
                                <option value="">Select an encounter...</option>
                                {availableDocs.map(doc => (
                                    <option key={doc} value={doc}>Document: {doc.substring(0, 8)}...</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-text-secondary">Encounter B (Newer)</label>
                            <select 
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none"
                                value={docB}
                                onChange={(e) => setDocB(e.target.value)}
                            >
                                <option value="">Select an encounter...</option>
                                {availableDocs.map(doc => (
                                    <option key={doc} value={doc}>Document: {doc.substring(0, 8)}...</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-center mt-2">
                        <button 
                            onClick={handleCompare}
                            disabled={!docA || !docB || docA === docB || loading}
                            className="px-8 py-3 rounded-full bg-brand-primary text-white font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(255,69,51,0.3)]"
                        >
                            {loading ? (
                                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                            ) : "Generate Comparison"}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center mt-4">
                            {error}
                        </div>
                    )}

                    {/* Results */}
                    {!loading && diffData && diffData.diffs && (
                        <div className="space-y-6 mt-6 border-t border-white/10 pt-8">
                            <h3 className="text-xl font-medium text-white mb-2">Clinical Differences</h3>
                            
                            {diffData.diffs.length === 0 ? (
                                <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-text-secondary">No significant clinical differences found between these encounters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {diffData.diffs.map((diff, idx) => {
                                        // Color code based on category
                                        let bgClass = "bg-white/5 border-white/10";
                                        let textClass = "text-white";
                                        let dotClass = "bg-white/30";
                                        
                                        if (diff.category === "New") {
                                            bgClass = "bg-green-500/10 border-green-500/20";
                                            dotClass = "bg-green-400";
                                            textClass = "text-green-100";
                                        } else if (diff.category === "Resolved") {
                                            bgClass = "bg-blue-500/10 border-blue-500/20";
                                            dotClass = "bg-blue-400";
                                            textClass = "text-blue-100";
                                        } else if (diff.category === "Changed") {
                                            bgClass = "bg-yellow-500/10 border-yellow-500/20";
                                            dotClass = "bg-yellow-400";
                                            textClass = "text-yellow-100";
                                        }

                                        return (
                                            <div key={idx} className={`p-5 rounded-xl border ${bgClass} flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center`}>
                                                <div className="flex items-start gap-4">
                                                    <div className={`mt-2 w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
                                                    <div>
                                                        <p className={`font-medium text-lg ${textClass}`}>{diff.description}</p>
                                                        <p className="text-sm text-text-secondary uppercase tracking-wider mt-2">{diff.event_type}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full shrink-0 ${bgClass} border`}>
                                                    {diff.category}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
