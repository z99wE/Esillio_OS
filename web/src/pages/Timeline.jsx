import { useContext } from "react";
import { useHealth } from "../context/HealthContext";
import GlassCard from "../components/GlassCard";
import { dummyPatients } from "../utils/dummyData";

export default function Timeline() {
    const { timeline, isLoading, error, currentPatientId, setCurrentPatientId } = useHealth();

    // timeline might be an object containing events depending on backend format
    const timelineEvents = Array.isArray(timeline) ? timeline : (timeline?.events || timeline?.timeline || []);

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                    Your Health <span className="font-primary italic drop-shadow-sm">Timeline</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Every uploaded document contributes to a continuous health story,
                    making trends and medical events easier to understand over time.
                </p>
            </div>

            {/* Patient Selector (Demo Mode) */}
            <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-full">
                {dummyPatients.slice(0, 3).map((p) => {
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

            {isLoading && (
                <div className="bg-neutral-surface border border-border-primary rounded-lg p-12 text-center">
                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-secondary font-medium">Reconstructing memory...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-400 text-center">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && timelineEvents.length === 0 && !error && (
                <div className="bg-neutral-surface border border-border-primary rounded-lg p-16 text-center relative overflow-hidden glass-panel">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px]"></div>
                    <h2 className="text-2xl font-medium text-text-primary mb-3 relative z-10">Blank Canvas</h2>
                    <p className="text-text-secondary relative z-10 max-w-md mx-auto">Upload your first medical report to begin building your longitudinal timeline.</p>
                </div>
            )}

            {!isLoading && timelineEvents.length > 0 && (
                <div className="relative border-l border-border-primary ml-4 sm:ml-8 pl-8 sm:pl-10 space-y-12 pb-12">
                    {/* Top gradient fade for the line */}
                    <div className="absolute top-0 left-[-1px] w-[2px] h-12 bg-gradient-to-b from-neutral-background to-transparent z-10"></div>
                    
                    {timelineEvents.map((event, index) => (
                        <div key={event.id || index} className="relative group">
                            {/* Timeline dot */}
                            <div className="absolute -left-[45px] sm:-left-[53px] top-6 h-5 w-5 rounded-full bg-neutral-surface border-2 border-brand-primary group-hover:scale-125 group-hover:bg-brand-primary transition-all duration-300 z-10 shadow-[0_0_10px_rgba(255,69,51,0.5)]" />
                            
                            <GlassCard className="relative p-6 sm:p-8 h-full transition-colors group-hover:bg-white/5">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-medium text-text">{event.title}</h3>
                                        {event.date && (
                                            <p className="text-sm text-accent font-medium mt-1">{event.date}</p>
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-text/70 w-max shrink-0 backdrop-blur-md">
                                        {event.category || "Clinical Event"}
                                    </span>
                                </div>
                                
                                {event.description && (
                                    <p className="text-text/70 leading-relaxed mb-6">{event.description}</p>
                                )}
                            </GlassCard>
                    </div>
                    ))}
                    
                    {/* Bottom gradient fade for the line */}
                    <div className="absolute bottom-0 left-[-1px] w-[2px] h-24 bg-gradient-to-t from-neutral-background to-transparent z-10"></div>
                </div>
            )}
        </div>
    );
}