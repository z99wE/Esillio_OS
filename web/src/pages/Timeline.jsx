import { useContext } from "react";
import { useHealth } from "../context/HealthContext";
import GlassCard from "../components/GlassCard";
import { dummyPatients } from "../utils/dummyData";

export default function Timeline() {
    const { timeline, isLoading, error, currentPatientId, setCurrentPatientId } = useHealth();

    const isDemoPatient = currentPatientId.startsWith('usr-demo-');
    const demoPatient = dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
    
    // Use demo timeline if a demo patient is selected, otherwise fallback to the real timeline from context
    let timelineEvents = [];
    if (isDemoPatient) {
        timelineEvents = demoPatient.timeline || [];
    } else {
        timelineEvents = Array.isArray(timeline) ? timeline : (timeline?.events || timeline?.timeline || []);
    }

    const exportToMarkdown = () => {
        if (!timelineEvents || timelineEvents.length === 0) return;
        
        let md = `# My Health Timeline\n\n`;
        timelineEvents.forEach(event => {
            md += `### ${event.title}\n`;
            if (event.date) md += `**Date:** ${event.date}\n`;
            else if (event.timestamp) md += `**Date:** ${new Date(event.timestamp).toLocaleString()}\n`;
            md += `**Category:** ${event.category || "Clinical Event"}\n\n`;
            if (event.description) md += `${event.description}\n\n`;
            md += `---\n\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'esillio_health_timeline.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-8 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight pb-2 leading-tight text-white">
                    Your Health <span className="font-primary italic drop-shadow-sm bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Timeline</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    Every uploaded document contributes to a continuous health story,
                    making trends and medical events easier to understand over time.
                </p>
                {timelineEvents.length > 0 && (
                    <button 
                        onClick={exportToMarkdown}
                        className="mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-brand-primary text-sm font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Export to Markdown
                    </button>
                )}
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
                            className={`shrink-0 p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-2xl group relative cursor-pointer snap-start transition-all duration-300 ${
                                isActive 
                                    ? 'scale-105 z-10' 
                                    : 'hover:-translate-y-1'
                            }`}
                        >
                            <div className={`absolute inset-0 blur-xl transition-opacity duration-500 pointer-events-none rounded-2xl ${
                                isActive ? 'bg-brand-primary/20 opacity-100' : 'bg-brand-primary/10 opacity-0 group-hover:opacity-100'
                            }`}></div>
                            <div className={`h-full bg-background/40 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border relative overflow-hidden transition-all duration-300 ${
                                isActive
                                    ? 'border-brand-primary/30 bg-white/5 shadow-[0_0_20px_rgba(255,69,51,0.2)] focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
                                    : 'border-white/5 group-hover:bg-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(255,69,51,0.15)] focus:outline-none focus:ring-2 focus:ring-brand-primary/50'
                            }`}>
                                <p className="font-primary whitespace-nowrap">
                                    <span className={`font-semibold transition-colors ${isActive ? 'text-text' : 'text-text/80 group-hover:text-text'}`}>{p.name}</span>
                                    <span className={`text-xs ml-2 transition-colors ${isActive ? 'text-text/70' : 'text-text/50 group-hover:text-text/70'}`}>({p.subtitle.split(' ')[0]})</span>
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