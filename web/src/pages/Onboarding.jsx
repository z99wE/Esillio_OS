import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        practiceType: "",
        clinicianCount: "",
        ehr: ""
    });

    const nextStep = () => setStep((s) => s + 1);
    
    const handleSelect = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setTimeout(nextStep, 300);
    };

    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center px-6 overflow-hidden">
            <DNABackground />
            <div className="relative z-10 w-full max-w-xl">
                <GlassCard className="p-8 md:p-12 border-white/10 shadow-[0_0_40px_rgba(138,43,226,0.15)] min-h-[400px] flex flex-col">
                    
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-300 ${step >= i ? 'bg-brand-primary' : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-text-secondary">Step {step} of 3</span>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold mb-2">What best describes your practice?</h2>
                                    <p className="text-text-secondary mb-6">This helps us tailor your Esillio workspace.</p>
                                    
                                    <div className="flex flex-col gap-3">
                                        {["Solo Practitioner", "Small Clinic (2-5 providers)", "Large Enterprise / Hospital"].map((opt) => (
                                            <button key={opt} onClick={() => handleSelect("practiceType", opt)} className={`w-full p-4 text-left rounded-xl border ${formData.practiceType === opt ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 hover:bg-white/5'} transition-all`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col justify-center">
                                    <h2 className="text-2xl font-bold mb-2">Which EHR do you currently use?</h2>
                                    <p className="text-text-secondary mb-6">We integrate directly with leading platforms.</p>
                                    
                                    <div className="flex flex-col gap-3">
                                        {["Epic", "Cerner", "Athenahealth", "Other / None"].map((opt) => (
                                            <button key={opt} onClick={() => handleSelect("ehr", opt)} className={`w-full p-4 text-left rounded-xl border ${formData.ehr === opt ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 hover:bg-white/5'} transition-all`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3">You're all set!</h2>
                                    <p className="text-text-secondary mb-8">
                                        Your profile has been created. Our team will review your application and reach out shortly to activate your workspace.
                                    </p>
                                    <Link to="/" className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-accent-purple text-white font-bold hover:scale-[1.02] transition-transform">
                                        Return Home
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
