import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, useMotionTemplate } from "framer-motion";
import Landing from "./Landing";
import Navbar from "../components/Navbar";
import DNABackground from "../components/DNABackground";
import ParticleLogo from "../components/ParticleLogo";

export default function IntroEntry() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Intro background fades out quickly to reveal Landing scrolling up
    const introBgOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    
    const [showNav, setShowNav] = useState(false);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > 0.8 && !showNav) {
            setShowNav(true);
        } else if (latest <= 0.8 && showNav) {
            setShowNav(false);
        }
    });

    return (
        <div className="relative w-full text-text-primary">
            
            {/* Nav appears after intro */}
            <AnimatePresence>
                {showNav && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="fixed top-0 w-full z-50"
                    >
                        <Navbar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Intro sequence track */}
            <div ref={containerRef} className="h-[250vh] relative w-full z-20">
                {/* Sticky Container - perfectly transparent so Landing is visible beneath */}
                <motion.div 
                    className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none"
                >
                    {/* Background elements fade out as Landing scrolls up */}
                    <motion.div style={{ opacity: introBgOpacity }} className="absolute inset-0 bg-neutral-background backdrop-blur-xl">
                        <DNABackground />
                    </motion.div>
                    
                    <ParticleLogo scrollProgress={scrollYProgress} />
                </motion.div>
            </div>

            {/* Main Content - Scrolls up naturally from under the intro */}
            <div className="relative z-10 w-full bg-neutral-background">
                <Landing />
            </div>
        </div>
    );
}
