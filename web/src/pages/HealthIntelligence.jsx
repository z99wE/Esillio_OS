import React from "react";
import useUpload from "../hooks/useUpload";
import { useHealth } from "../context/HealthContext";
import { dummyPatients } from "../utils/dummyData";
import GlassCard from "../components/GlassCard";

export default function HealthIntelligence() {
    const uploadContext = useUpload();
    const { currentPatientId, setCurrentPatientId } = useHealth();
    
    // Find selected patient (memoized)
    const selectedPatient = React.useMemo(() => {
        return dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
    }, [currentPatientId]);
    
    // Fallback to dummy data to show the effect (memoized)
    const upload = React.useMemo(() => {
        return uploadContext || {
            document: { filename: `Last_Record_${selectedPatient.name.split(' ')[0]}.pdf` },
            timeline: { events_created: selectedPatient.intelligenceStats?.eventsExtracted || 0, events: selectedPatient.timeline || [] },
            clinical_intelligence: { 
                guardian: selectedPatient.intelligenceStats?.guardianStatus === "Optimal" || selectedPatient.intelligenceStats?.guardianStatus === "Stable", 
                clinical_memory: true 
            },
            status: selectedPatient.intelligenceStats?.pipelineStatus || "Complete"
        };
    }, [uploadContext, selectedPatient]);

    const timeline = upload.timeline || {};
    const intelligence = upload.clinical_intelligence || {};

    return (
        <div className="w-full max-w-6xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                    Your health story is <span className="font-primary italic drop-shadow-sm">taking shape</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Esillio has processed your records and updated your clinical memory.
                </p>
            </div>

            {/* Patient Selector (Demo Mode) */}
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
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setCurrentPatientId(p.id);
                                }
                            }}
                            className={`shrink-0 p-[1px] rounded-2xl group relative cursor-pointer snap-start transition-all duration-300 ${
                                isActive 
                                    ? 'bg-gradient-to-b from-brand-primary/50 to-brand-primary/10 scale-105 z-10' 
                                    : 'bg-gradient-to-b from-white/10 to-white/0 hover:-translate-y-1'
                            }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-2xl pointer-events-none transition-opacity duration-300"></div>
                            )}
                            <div className={`h-full rounded-2xl px-6 py-3 shadow-lg relative overflow-hidden transition-all duration-300 ${
                                isActive
                                    ? 'bg-brand-primary/10 border border-brand-primary/50'
                                    : 'bg-background/40 backdrop-blur-xl border border-white/5 group-hover:bg-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(255,69,51,0.15)]'
                            }`}>
                                <p className="font-primary whitespace-nowrap">
                                    <span className={`font-semibold ${isActive ? 'text-brand-primary' : 'text-text'}`}>{p.name}</span>
                                    <span className={`text-xs ml-2 ${isActive ? 'text-brand-primary/70' : 'text-text/50'}`}>({p.subtitle.split(' ')[0]})</span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                
                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Document</h3>
                    <h2 className="text-xl font-medium text-text truncate" title={upload.document?.filename || "Medical Record"}>
                        {upload.document?.filename || "Medical Record"}
                    </h2>
                    <p className="text-sm text-accent font-medium mt-auto pt-4">Successfully processed</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Timeline</h3>
                    <h2 className="text-4xl font-medium text-text">
                        {timeline.events_created ?? 0}
                    </h2>
                    <p className="text-sm text-text/70 mt-auto pt-4">Clinical events extracted</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Pipeline</h3>
                    <h2 className="text-xl font-medium text-text capitalize">
                        {upload.status || "Complete"}
                    </h2>
                    <p className="text-sm text-text/70 mt-auto pt-4">AI processing status</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Guardian</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-3 h-3 rounded-full ${intelligence.guardian ? 'bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]' : 'bg-white/5 border border-white/10'}`}></div>
                        <h2 className="text-lg font-medium text-text">
                            {intelligence.guardian ? "Review Complete" : "Waiting"}
                        </h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Clinical safety check</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">Clinical Memory</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className={`w-3 h-3 rounded-full ${intelligence.clinical_memory ? 'bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]' : 'bg-white/5 border border-white/10'}`}></div>
                        <h2 className="text-lg font-medium text-text">
                            {intelligence.clinical_memory ? "Updated" : "Pending"}
                        </h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Longitudinal state</p>
                </GlassCard>

                <GlassCard className="flex flex-col gap-2 h-full justify-between !p-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-text/70 mb-2">EsiWell</h3>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(255,69,51,0.5)]"></div>
                        <h2 className="text-lg font-medium text-text">Active</h2>
                    </div>
                    <p className="text-sm text-text/70 mt-auto pt-4">Knowledge layer</p>
                </GlassCard>

            </div>

            {/* TIMELINE PREVIEW */}
            {timeline.events && timeline.events.length > 0 && (
                <div className="p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-3xl w-full">
                    <div className="bg-background/40 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl">
                        <h2 className="text-2xl font-medium text-text mb-8 border-b border-white/10 pb-4">Recent Discoveries</h2>
                        <div className="space-y-4">
                            {timeline.events.map((event, index) => (
                                <div key={event.id || index} className="group relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-b from-accent/10 to-accent/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 transition-colors gap-4">
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
    );
}