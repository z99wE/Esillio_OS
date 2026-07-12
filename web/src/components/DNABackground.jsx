import React from "react";
import { motion } from "framer-motion";

export default function DNABackground() {
    // Generate an array of 20 pairs for the DNA strands
    const pairs = Array.from({ length: 20 });

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[0] opacity-30 mix-blend-screen flex justify-center items-center">
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-brand-primary)]/15 rounded-full blur-[120px]" />
            
            {/* DNA Helix Container */}
            <div className="relative w-[1200px] h-[100px] flex justify-between items-center -rotate-[25deg] scale-[1.5]">
                {pairs.map((_, i) => (
                    <div key={i} className="relative w-[2px] h-full mx-auto" style={{ perspective: '800px' }}>
                        {/* Connecting line */}
                        <motion.div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] bg-gradient-to-b from-[var(--color-brand-primary)]/0 via-[var(--color-accent-blue)]/40 to-[var(--color-accent-purple)]/0"
                            animate={{
                                height: ["0%", "100%", "0%"],
                                opacity: [0, 0.5, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                        
                        {/* Strand 1 Dot */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[var(--color-brand-primary)] shadow-[0_0_15px_var(--color-brand-primary)]"
                            animate={{
                                y: ["-50px", "50px", "-50px"],
                                scale: [0.5, 1.5, 0.5],
                                opacity: [0.3, 1, 0.3],
                                zIndex: [0, 10, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                        
                        {/* Strand 2 Dot */}
                        <motion.div
                            className={`absolute left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full ${i % 2 === 0 ? 'bg-[var(--color-accent-blue)] shadow-[0_0_10px_var(--color-accent-blue)]' : 'bg-[var(--color-accent-purple)] shadow-[0_0_10px_var(--color-accent-purple)]'}`}
                            animate={{
                                y: ["50px", "-50px", "50px"],
                                scale: [1.5, 0.5, 1.5],
                                opacity: [1, 0.3, 1],
                                zIndex: [10, 0, 10]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
