import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import { Link } from "react-router-dom";

const MOCK_EVENTS = [
    {
        id: "mock1",
        date: "2024-05-12",
        type: "lab_result",
        title: "Comprehensive Metabolic Panel",
        provider: "Quest Diagnostics",
        summary: "Elevated ALT (65 U/L) and AST (42 U/L). Fasting glucose slightly elevated at 102 mg/dL. All other values within normal limits.",
        ai_insights: "Mild transaminitis noted. Could be related to recent medication changes or fatty liver. Needs correlation with clinical picture."
    },
    {
        id: "mock2",
        date: "2024-05-01",
        type: "clinical_note",
        title: "Primary Care Visit",
        provider: "Dr. Sarah Chen",
        summary: "Patient reported new onset of fatigue and mild right upper quadrant discomfort. Started on Atorvastatin 20mg for hyperlipidemia 2 months ago.",
        ai_insights: "The recent start of statin therapy correlates with the subsequent elevated liver enzymes (ALT/AST). A classic adverse effect pattern."
    }
];

export default function DemoFlow() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent">
                        Case Study: Statin-Induced Transaminitis
                    </h1>
                    <Link to="/waitlist" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors border border-white/10 whitespace-nowrap">
                        Join Waitlist
                    </Link>
                </div>
                
                <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-xl mb-8 flex items-start gap-4">
                    <span className="text-brand-primary text-xl">💡</span>
                    <p className="text-sm text-text-secondary">
                        <strong>Esillio Intelligence:</strong> Notice how Esillio automatically connected the start of statin therapy on May 1st to the elevated liver enzymes on May 12th, surfacing a critical insight that a busy clinician might miss when reviewing separate reports.
                    </p>
                </div>

                <div className="relative border-l-2 border-white/10 pl-8 ml-4 flex flex-col gap-10">
                    {MOCK_EVENTS.map(event => (
                        <div key={event.id} className="relative">
                            <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full bg-brand-primary border-4 border-[#0A0A0A] z-10"></div>
                            <div className="text-sm text-brand-primary font-bold mb-2 tracking-wide uppercase">
                                {event.date} &bull; {event.provider}
                            </div>
                            <GlassCard className="p-6 border-white/5">
                                <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                                <p className="text-text-secondary text-sm mb-4 bg-white/5 p-4 rounded-lg">{event.summary}</p>
                                
                                {event.ai_insights && (
                                    <div className="flex gap-3 items-start border-t border-white/10 pt-4 mt-2">
                                        <div className="w-6 h-6 rounded bg-gradient-to-r from-brand-primary to-accent-purple flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-white text-xs">✨</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">AI Insight</span>
                                            <p className="text-sm text-brand-primary/90">{event.ai_insights}</p>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
