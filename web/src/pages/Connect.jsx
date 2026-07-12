import React from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";

export default function Connect() {
    const integrations = [
        {
            name: "Apple Health",
            description: "Sync your vitals, workouts, and sleep data seamlessly from your Apple Watch and iPhone.",
            color: "from-rose-500/20 to-red-600/20",
            border: "group-hover:border-rose-500/50"
        },
        {
            name: "Google Health",
            description: "Connect your Android ecosystem for comprehensive daily activity and health metrics tracking.",
            color: "from-blue-500/20 to-cyan-600/20",
            border: "group-hover:border-blue-500/50"
        },
        {
            name: "Oura Ring",
            description: "Deep insights into your readiness, sleep stages, and physiological stress.",
            color: "from-amber-500/20 to-orange-600/20",
            border: "group-hover:border-amber-500/50"
        }
    ];

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden pt-24 pb-20 px-6 font-sans">
            <DNABackground />

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="text-center flex flex-col items-center gap-4 mb-16">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                        Your Biology, Connected.
                    </h1>
                    <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Esillio OS acts as the local intelligence layer for all your wearables and medical devices. All data remains strictly on your device.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {integrations.map((integration, index) => (
                        <div key={index} className="group relative">
                            <GlassCard className={`relative h-full transition-all duration-300 ${integration.border}`}>

                                
                                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight mt-12">
                                    {integration.name}
                                </h3>
                                
                                <p className="text-gray-400 font-light leading-relaxed mb-8">
                                    {integration.description}
                                </p>
                                
                                <button disabled className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-gray-500 font-medium cursor-not-allowed transition-colors mt-auto">
                                    Integration Locked - Coming Soon
                                </button>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
