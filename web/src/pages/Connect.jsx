import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";

// Inline SVG icons to avoid external dependencies
const AppleHealthIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8C24 8 18 4 12 8C6 12 6 20 12 26C18 32 24 40 24 40C24 40 30 32 36 26C42 20 42 12 36 8C30 4 24 8 24 8Z" fill="url(#appleGrad)" />
    <defs>
      <linearGradient id="appleGrad" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF4533" />
        <stop offset="1" stopColor="#FF8A80" />
      </linearGradient>
    </defs>
  </svg>
);

const GoogleHealthIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="url(#googleGrad)" />
    <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="googleGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4285F4" />
        <stop offset="1" stopColor="#00BCD4" />
      </linearGradient>
    </defs>
  </svg>
);

const OuraRingIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" stroke="url(#ouraGrad)" strokeWidth="5" fill="none" />
    <circle cx="24" cy="24" r="7" fill="url(#ouraGrad2)" />
    <defs>
      <linearGradient id="ouraGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EF4444" />
      </linearGradient>
      <linearGradient id="ouraGrad2" x1="17" y1="17" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCD34D" />
        <stop offset="1" stopColor="#F97316" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Connect() {
    const integrations = [
        {
            name: "Apple Health",
            description: "Sync your vitals, workouts, and sleep data seamlessly from your Apple Watch and iPhone.",
            icon: <AppleHealthIcon />,
            color: "from-rose-500/20 to-red-600/20",
            glow: "rgba(255, 69, 51, 0.15)",
            borderHover: "group-hover:border-rose-500/50",
        },
        {
            name: "Google Health",
            description: "Connect your Android ecosystem for comprehensive daily activity and health metrics tracking.",
            icon: <GoogleHealthIcon />,
            color: "from-blue-500/20 to-cyan-600/20",
            glow: "rgba(66, 133, 244, 0.15)",
            borderHover: "group-hover:border-blue-500/50",
        },
        {
            name: "Oura Ring",
            description: "Deep insights into your readiness, sleep stages, and physiological stress.",
            icon: <OuraRingIcon />,
            color: "from-amber-500/20 to-orange-600/20",
            glow: "rgba(245, 158, 11, 0.15)",
            borderHover: "group-hover:border-amber-500/50",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden pt-24 pb-20 px-6 font-sans">
            <DNABackground />

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                        Your Biology,{' '}
                        <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">
                            Connected
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4 font-primary">
                        Esillio OS acts as the local intelligence layer for all your wearables and medical devices. All data remains strictly on your device.
                    </p>
                </div>

                {/* Integration Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {integrations.map((integration, index) => (
                        <div key={index} className="group relative">
                            <GlassCard className={`relative h-full flex flex-col transition-all duration-300 ${integration.borderHover}`}>
                                {/* Hover glow */}
                                <div
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 50% 30%, ${integration.glow} 0%, transparent 70%)` }}
                                />

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${integration.color} border border-white/10 flex items-center justify-center mb-5 relative z-10`}>
                                    {integration.icon}
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight font-primary relative z-10">
                                    {integration.name}
                                </h3>

                                <p className="text-gray-400 font-light leading-relaxed mb-6 text-sm font-primary relative z-10 flex-1">
                                    {integration.description}
                                </p>

                                <button
                                    disabled
                                    className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-gray-500 text-sm font-medium cursor-not-allowed transition-colors font-primary relative z-10"
                                >
                                    Coming Soon
                                </button>
                            </GlassCard>
                        </div>
                    ))}
                </div>

                {/* Bottom note */}
                <p className="text-center text-xs text-text-secondary/50 font-primary mt-12">
                    All integrations are end-to-end encrypted. Esillio never stores raw sensor data on remote servers.
                </p>
            </div>
        </div>
    );
}
