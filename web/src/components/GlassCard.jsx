import React, { useRef, useState } from "react";

export default function GlassCard({
    children,
    className = "",
    noPadding = false
}) {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div 
            className="perspective-[1000px] group relative"
            style={{ perspective: "1000px" }}
        >
            {/* Liquid Morphism Outer Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-brand-primary/40 via-[#8A2BE2]/40 to-[#00E5FF]/40 rounded-[var(--radius)] blur opacity-0 group-hover:opacity-100 transition duration-700 ease-out z-0 pointer-events-none"></div>

            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`
                    relative bg-white/5 border border-white/10 rounded-radius shadow-[0_16px_40px_-8px_rgba(0,0,0,0.5)]
                    backdrop-blur-[40px] overflow-hidden transition-all duration-300 ease-out
                    ${noPadding ? "" : "p-6 sm:p-8"}
                    ${className}
                `}
                style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(0)`,
                }}
            >
                {/* Subtle noise/texture overlay for premium feel */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,69,51,0.2) 0%, rgba(0,85,255,0.1) 50%, transparent 80%)',
                        transform: 'translateZ(20px)'
                    }}
                />
                <div className="absolute inset-0 pointer-events-none rounded-radius border-2 border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" style={{ transform: 'translateZ(1px)' }} />
                <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}