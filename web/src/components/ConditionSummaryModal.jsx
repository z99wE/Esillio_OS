import React, { useState, useEffect } from "react";
import client from "../api/client";

export default function ConditionSummaryModal({ condition, onClose }) {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!condition) return;
        
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const res = await client.get(`/timeline/summary?condition=${encodeURIComponent(condition)}`);
                setSummaryData(res.data.data);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
                setError(err.response?.data?.detail || "Failed to generate summary.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [condition]);

    if (!condition) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-neutral-surface border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col relative">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 id="modal-title" className="text-2xl font-medium text-white flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(255,69,51,0.5)]" aria-hidden="true" />
                        Summary: {condition}
                    </h2>
                    <button onClick={onClose} aria-label="Close dialog" className="text-text-secondary hover:text-white transition-colors p-2">
                        <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1" aria-live="polite" aria-busy={loading}>
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                            <p className="text-text-secondary">Analyzing medical history for {condition}...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    {!loading && !error && summaryData && (
                        <div className="space-y-8">
                            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-5">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-primary/80 mb-2">Narrative Summary</h3>
                                <p className="text-white/90 leading-relaxed">{summaryData.summary}</p>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-text/50 mb-4">Chronological Evidence</h3>
                                <div className="space-y-4">
                                    {summaryData.timeline?.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-white font-medium">{item.description}</p>
                                                <span className="text-xs text-text-secondary whitespace-nowrap ml-4">{item.date}</span>
                                            </div>
                                            
                                            {item.citations?.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-white/5">
                                                    <p className="text-xs text-text/50 mb-2 uppercase tracking-wider">Sources</p>
                                                    <ul className="space-y-2">
                                                        {item.citations.map((cite, cIdx) => (
                                                            <li key={cIdx} className="text-sm text-text-secondary bg-black/20 p-2 rounded text-xs">
                                                                <span className="text-accent">Doc {cite.document_id.substring(0, 8)}</span>: "{cite.source_snippet}"
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {(!summaryData.timeline || summaryData.timeline.length === 0) && (
                                        <p className="text-text-secondary text-sm">No historical events found for this condition.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
