import React, { useState, useEffect } from "react";
import client from "../api/client";
import GlassCard from "../components/GlassCard";
import ReactMarkdown from "react-markdown";
import DNABackground from "../components/DNABackground";

export default function ClinicianQueue() {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [editingContent, setEditingContent] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await client.get("/api/education/?status=draft");
            setDrafts(res.data?.data || []);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch drafts.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectDraft = (draft) => {
        setSelectedDraft(draft);
        setEditingContent(draft.content_md);
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedDraft) return;
        setActionLoading(true);
        try {
            await client.patch(`/api/education/${selectedDraft.id}`, {
                status: status,
                content_md: editingContent
            });
            setSelectedDraft(null);
            fetchDrafts();
        } catch (e) {
            console.error(e);
            alert("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] overflow-hidden">
            <DNABackground />
            <div className="w-full max-w-6xl mx-auto py-16 px-4 relative z-10 animate-fade-in-up">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                    Clinician <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Review Queue</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4 font-primary">
                    Review, edit, and approve auto-generated patient education drafts based on timeline events.
                </p>
            </div>

            {loading && (
                <div className="flex justify-center my-12">
                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 text-center mb-8 font-primary">
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && drafts.length === 0 && (
                 <div className="bg-neutral-surface border border-border-primary rounded-xl p-16 text-center relative overflow-hidden glass-panel">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px]"></div>
                 <h2 className="text-2xl font-primary font-medium text-text-primary mb-3 relative z-10">No Pending Drafts</h2>
                 <p className="text-text-secondary relative z-10 max-w-md mx-auto font-primary">
                     You're all caught up! Auto-generated education drafts will appear here for your review when patients receive new diagnoses.
                 </p>
             </div>
            )}

            {!loading && drafts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: List */}
                    <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {drafts.map(draft => (
                            <GlassCard 
                                key={draft.id} 
                                className={`p-4 cursor-pointer transition-all border ${selectedDraft?.id === draft.id ? 'border-brand-primary bg-white/10' : 'border-white/5 hover:bg-white/5'}`}
                                onClick={() => handleSelectDraft(draft)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full border bg-orange-500/20 text-orange-400 border-orange-500/30 font-primary">
                                        Draft
                                    </span>
                                    <span className="text-xs text-text-secondary font-primary">
                                        {new Date(draft.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-lg font-medium text-white font-primary">{draft.title}</h3>
                                <p className="text-xs text-text-secondary mt-1 font-primary truncate">Patient ID: {draft.patient_id.substring(0,8)}...</p>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Right Col: Editor */}
                    <div className="lg:col-span-2">
                        {selectedDraft ? (
                            <GlassCard className="p-6 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-primary font-medium text-white">{selectedDraft.title}</h2>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleUpdateStatus('rejected')}
                                            disabled={actionLoading}
                                            className="px-5 py-2.5 rounded-xl bg-neutral-surface/50 text-white hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 font-secondary text-sm font-medium transition-all duration-300 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus('approved')}
                                            disabled={actionLoading}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-[#8A2BE2] text-white hover:shadow-cta border border-white/20 font-secondary text-sm font-medium transition-all duration-300 disabled:opacity-50"
                                        >
                                            Approve & Publish
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-text-secondary font-secondary tracking-wide uppercase">Edit Content (Markdown)</label>
                                        <div className="glass-panel rounded-xl overflow-hidden h-[500px]">
                                            <textarea 
                                                className="w-full h-full bg-transparent border-none p-5 text-sm text-white/90 font-mono focus:ring-0 outline-none resize-none custom-scrollbar"
                                                value={editingContent}
                                                onChange={e => setEditingContent(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-text-secondary font-secondary tracking-wide uppercase">Preview</label>
                                        <div className="glass-panel rounded-xl p-6 h-[500px] overflow-y-auto custom-scrollbar">
                                            <div className="prose prose-invert prose-brand max-w-none font-secondary prose-headings:font-primary prose-headings:font-normal">
                                                <ReactMarkdown>{editingContent}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ) : (
                            <div className="h-full min-h-[500px] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-text-secondary font-primary bg-white/5">
                                Select a draft to review and edit
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}


