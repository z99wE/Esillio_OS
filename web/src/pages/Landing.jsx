import { Link } from "react-router-dom";
import DNABackground from "../components/DNABackground";
import GlassCard from "../components/GlassCard";
const ROTATING_HEADLINES = [
    "Your future doctor shouldn't start from zero.",
    "The smartest health record is the one you actually use.",
    "Health memories fade. EsiWell preserves them.",
    "Small symptoms become big clues when they're connected.",
    "Most people remember the diagnosis, not the journey that led to it.",
    "Symptoms disappear. Patterns remain.",
    "The hardest medical question is often: When did this begin?",
    "Missing health context leads to repeated tests.",
    "Watch your health evolve instead of guessing what changed.",
    "Don't just store health data. Make it useful."
];

export default function Landing() {
    return (
        <main className="bg-neutral-background text-text-primary overflow-hidden w-full min-h-screen relative">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-8 sm:pt-16 pb-32 sm:pb-64">
                <DNABackground />
                <div className="absolute left-1/2 bottom-[-200px] sm:bottom-[-400px] w-[800px] sm:w-[1200px] h-[500px] sm:h-[800px] transform -translate-x-1/2 z-[1]">
                    <div className="absolute left-1/2 top-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] blur-[70px] animate-spin-slow opacity-60"></div>
                    <div className="absolute left-1/2 top-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff8844,#ff4533,#ffaa66)] blur-[32px] animate-spin-reverse opacity-50"></div>
                </div>
                <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-6 sm:gap-8 text-center mt-20">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-medium -tracking-[0.04em] leading-tight max-w-4xl px-4">
                        <span className="bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Your body remembers.</span> <br/>
                        <span className="font-primary font-normal italic text-brand-primary">Now your healthcare can too.</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl font-medium -tracking-[0.02em] text-text-secondary max-w-2xl leading-relaxed px-4">
                        Build your personal health timeline, one note at a time.
                        <br/><br/>
                        EsiWell transforms fragmented health information into a living, searchable, AI-powered health memory, helping people preserve context, uncover patterns, and make better health decisions over time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 w-full sm:w-auto px-4">
                        <Link to="/upload" className="w-full sm:w-auto text-center inline-flex items-center justify-center px-6 py-4 rounded-sm font-medium text-base bg-brand-primary text-text-primary hover:bg-[#d63a2b] transition-all duration-300 transform hover:-translate-y-0.5 shadow-cta z-[10] border border-white/20">
                            Start Building My Health Memory
                        </Link>
                    </div>
                </div>
            </section>

            {/* MARQUEE SECTION */}
            <section className="py-8 md:py-16 bg-neutral-background shadow-[0_0_32px_48px_theme(colors.neutral-background)] relative z-[2]">
                <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]">
                    <div className="flex items-center gap-12 sm:gap-20 animate-text-marquee whitespace-nowrap">
                        {[...ROTATING_HEADLINES, ...ROTATING_HEADLINES].map((headline, i) => (
                            <span key={i} className="text-lg sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent opacity-30 transition-opacity hover:opacity-80">
                                {headline}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEAR-BASED SECTION */}
            <section className="py-16 md:py-24 relative z-[1]">
                <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center flex flex-col gap-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium -tracking-[0.04em] leading-relaxed bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">
                        Understand What Changed
                    </h2>
                    <div className="flex flex-col gap-4 text-lg text-text-secondary">
                        <p>Every missing report forces someone to make decisions with incomplete information.</p>
                        <p>Health history isn't valuable when it's archived. It's valuable when it's available.</p>
                        <p>The best time to organize your medical history was years ago. The second best time is today.</p>
                        <p className="text-brand-primary font-medium mt-4">The most expensive medical mistake is repeating one that was already documented.</p>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-16 md:py-24 relative z-[1]">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        
                        {/* Timeline */}
                        <GlassCard className="relative flex flex-col items-center text-center gap-4 sm:gap-6 group">
                            <div className="absolute w-[500px] h-[500px] rounded-full opacity-40 z-[1] bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] animate-spin-slow top-[-400px] left-[-260px] pointer-events-none blur-[40px]"></div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-primary italic z-[2] bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Autonomous Health Memory.</h3>
                            <p className="text-sm sm:text-base text-text-secondary z-[2]">
                                Esillio runs local background agents to continuously ingest, structure, and organize your scattered medical records into a single longitudinal timeline.
                            </p>
                        </GlassCard>
                        
                        {/* Clinical Memory */}
                        <GlassCard className="relative flex flex-col items-center text-center gap-4 sm:gap-6 group">
                            <div className="absolute w-[500px] h-[500px] rounded-full opacity-40 z-[1] bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] animate-spin-slow top-[-400px] right-[-260px] transform rotate-[224deg] pointer-events-none blur-[40px]"></div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-primary italic z-[2] bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Local-First Clinical Intelligence.</h3>
                            <p className="text-sm sm:text-base text-text-secondary z-[2]">
                                Our embedded models analyze dozens of complex reports instantly, providing an evolving understanding of your health, without your data ever leaving your machine.
                            </p>
                        </GlassCard>
                        
                        {/* AI */}
                        <div className="lg:col-span-2 perspective-[1000px]">
                            <GlassCard className="h-full bg-gradient-to-br from-[rgba(255,69,51,0.1)] via-[rgba(138,43,226,0.05)] to-transparent border border-white/10 flex flex-col items-center text-center gap-4 sm:gap-6 group">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-primary italic z-[2] bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Bring Your Own Agents.</h3>
                                <p className="text-sm sm:text-base text-text-secondary max-w-2xl z-[2]">
                                    Intelligence requires context. Deploy specialized healthcare agents (or build your own) that run directly on top of your complete medical history. Your data, your models.
                                </p>
                            </GlassCard>
                        </div>

                    </div>
                </div>
            </section>

            {/* COMPARATIVE ANALYSIS SECTION */}
            <section className="py-16 md:py-24 relative z-[1]">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium -tracking-[0.04em] leading-relaxed bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">
                            Why Esillio is Different
                        </h2>
                        <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
                            Unlike traditional health apps that lock your data in the cloud, Esillio is built for ownership, privacy, and continuous context.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto perspective-[1000px]">
                        {/* Competitors Card */}
                        <GlassCard className="relative flex flex-col gap-6 p-8 opacity-80 scale-95 border-red-500/10">
                            <h3 className="text-xl font-semibold text-text-secondary text-center uppercase tracking-widest border-b border-white/5 pb-4">Traditional Cloud Apps</h3>
                            <ul className="space-y-4 text-text-secondary text-sm">
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-red-400/80">✗ Sent to Cloud</span>
                                    <span>Your sensitive medical data leaves your device for processing.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-red-400/80">✗ Vendor Lock-in</span>
                                    <span>Forced to use their proprietary AI models and pay subscriptions.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-red-400/80">✗ Session Amnesia</span>
                                    <span>Every chat starts from zero. No longitudinal memory of your past.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-red-400/80">✗ Single Chatbot</span>
                                    <span>A generic AI tries to answer everything without specialized medical reasoning.</span>
                                </li>
                            </ul>
                        </GlassCard>

                        {/* Esillio Card */}
                        <GlassCard className="relative flex flex-col gap-6 p-8 shadow-[0_0_30px_rgba(138,43,226,0.15)] border-brand-primary/20 z-10 scale-100 hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-accent-purple text-center border-b border-white/10 pb-4">Esillio OS</h3>
                            <ul className="space-y-4 text-text-primary text-sm">
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-brand-primary flex items-center gap-2">✓ Local-First Privacy</span>
                                    <span className="text-text-secondary">Process everything locally. Your data never leaves your device by default.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-brand-primary flex items-center gap-2">✓ Bring Your Own AI</span>
                                    <span className="text-text-secondary">Plug in OpenAI, Anthropic, or run totally offline with local LLMs.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-brand-primary flex items-center gap-2">✓ Biological Continuity Compiler™</span>
                                    <span className="text-text-secondary">Builds a persistent, queryable timeline from scattered records using ChromaDB.</span>
                                </li>
                                <li className="flex flex-col gap-1">
                                    <span className="font-bold text-brand-primary flex items-center gap-2">✓ Multi-Agent Orchestration</span>
                                    <span className="text-text-secondary">Specialized agents (EsiDiet, EsiCalm) run in parallel for nuanced wellness insights.</span>
                                </li>
                            </ul>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* TRUST & PRIVACY */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-col lg:flex-row justify-center items-start gap-6 sm:gap-8 lg:gap-12">
                        
                        {/* Privacy */}
                        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-[450px]">
                            <h3 className="text-2xl sm:text-3xl font-medium -tracking-[0.02em] bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Your health belongs to you.</h3>
                            <ul className="relative w-full p-6 sm:p-8 border border-border-primary rounded-lg flex flex-col gap-4 sm:gap-6 bg-neutral-surface overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl">
                                <div className="absolute w-[500px] h-[500px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ffaa66,#ff4533,#8a2be2)] blur-[60px] animate-spin-reverse top-[-250px] right-[-250px] transform rotate-[228deg] opacity-20"></div>
                                <li className="flex items-start gap-3 z-[1]">
                                    <span className="text-text-secondary">Your medical history remains under your control.</span>
                                </li>
                                <li className="flex items-start gap-3 z-[1]">
                                    <span className="text-text-secondary">Choose your preferred AI provider.</span>
                                </li>
                                <li className="flex items-start gap-3 z-[1]">
                                    <span className="text-text-secondary">Use local models. Bring your own API.</span>
                                </li>
                                <li className="flex items-start gap-3 z-[1]">
                                    <span className="text-text-secondary">Export your data anytime. No vendor lock-in.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Trust */}
                        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-[450px]">
                            <h3 className="text-2xl sm:text-3xl font-medium -tracking-[0.02em] bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Built for trust. Not dependency.</h3>
                            <ul className="relative w-full p-6 sm:p-8 border border-border-primary rounded-lg flex flex-col gap-4 sm:gap-6 bg-neutral-background overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl">
                                <div className="absolute w-[500px] h-[500px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#0055ff,#8a2be2,#ff4533)] blur-[60px] animate-spin-reverse top-[-250px] right-[-250px] transform rotate-[228deg] opacity-20"></div>
                                <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium -tracking-[0.02em] text-text-primary z-[1]">
                                    <span className="text-brand-primary font-bold">✓</span> Local-first architecture
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium -tracking-[0.02em] text-text-primary z-[1]">
                                    <span className="text-brand-primary font-bold">✓</span> Bring Your Own AI
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium -tracking-[0.02em] text-text-primary z-[1]">
                                    <span className="text-brand-primary font-bold">✓</span> Transparent processing
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium -tracking-[0.02em] text-text-primary z-[1]">
                                    <span className="text-brand-primary font-bold">✓</span> Portable records
                                </li>
                                <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg font-medium -tracking-[0.02em] text-text-primary z-[1]">
                                    <span className="text-brand-primary font-bold">✓</span> Export anytime
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-border-primary bg-neutral-surface mt-16 text-sm text-text-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between gap-12">
                    <div className="flex-1 max-w-md">
                        <span className="font-primary text-2xl text-text-primary mb-4 block tracking-wide">Esillio</span>
                        <p className="mb-2">Healthcare should remember.</p>
                        <p className="mb-2">Built with privacy first.</p>
                        <p>Bring Your Own AI.</p>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                        <div>
                            <strong className="text-text-primary block mb-2">Medical Disclaimer</strong>
                            <p className="text-xs">Esillio is an educational clinical intelligence platform. It does not diagnose, treat, cure or prevent disease and should never replace qualified medical professionals. Always consult licensed healthcare providers before making medical decisions.</p>
                        </div>
                        <div>
                            <strong className="text-text-primary block mb-2">Privacy Disclaimer</strong>
                            <p className="text-xs">Your data remains under your control. Third-party AI providers are only used when explicitly configured by you. Their privacy policies apply to requests sent to their services.</p>
                        </div>
                        <div>
                            <strong className="text-text-primary block mb-2">AI Transparency</strong>
                            <p className="text-xs">AI-generated summaries and insights may contain inaccuracies. Always verify important medical information with original reports and qualified clinicians.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
