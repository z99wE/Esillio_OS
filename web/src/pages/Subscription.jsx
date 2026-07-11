import React from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";


export default function Subscription() {
    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden pt-24 pb-20 px-6 font-sans">
            <DNABackground />

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="text-center flex flex-col items-center gap-4 mb-20">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                        Unlock Esillio Pro.
                    </h1>
                    <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Take full control of your biological intelligence with unlimited cloud sync, advanced multimodal inference, and priority access to new features.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Local Tier (Free) */}
                    <GlassCard className="relative p-8 md:p-12 border-white/10">
                        <div className="mb-8">
                            <h3 className="text-3xl font-semibold mb-2">Esillio Local</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-5xl font-bold text-white">$0</span>
                                <span className="text-gray-400">/ forever</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">Everything you need for private, local biological intelligence.</p>
                        </div>

                        <div className="space-y-4 mb-12">
                            <FeatureItem text="Bring Your Own LLM (Local / API)" />
                            <FeatureItem text="100% Local Data Storage" />
                            <FeatureItem text="Standard Timeline View" />
                        </div>

                        <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                            Current Plan
                        </button>
                    </GlassCard>

                    {/* Pro Tier (Coming Soon) */}
                    <div className="relative group">
                        <GlassCard className="relative p-8 md:p-12 border-brand-primary/50 h-full">


                            <div className="mb-8">
                                <h3 className="text-3xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF]">Esillio Pro</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-5xl font-bold text-white">$20</span>
                                    <span className="text-gray-400">/ month</span>
                                </div>
                                <p className="text-gray-400 leading-relaxed">Advanced intelligence and effortless cloud synchronization.</p>
                            </div>

                            <div className="space-y-4 mb-12">
                                <FeatureItem text="Included Cloud Inference (Unlimited)" />
                                <FeatureItem text="End-to-End Encrypted Cloud Backup" />
                                <FeatureItem text="Multimodal Document Analysis" />
                                <FeatureItem text="Predictive Health Analytics" />
                            </div>

                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-[#ffaa66] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group/btn">
                                Join Waitlist
                            </button>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-brand-primary font-bold text-sm">✓</span>
            </div>
            <span className="text-gray-300 font-light">{text}</span>
        </div>
    );
}
