import React, { useState, useRef } from 'react';

import apiClient from '../api/client';

const SUGGESTED_PROMPTS = [
    "Started taking 500mg Metformin twice daily with meals",
    "Feeling sharp pain in my lower back after lifting a box",
    "Diagnosed with Type 2 Diabetes by Dr. Smith yesterday",
    "My blood pressure was 120/80 during my morning check",
    "Experiencing mild headaches and blurry vision since Tuesday",
    "Received second dose of COVID-19 vaccine, feeling feverish",
    "Cholesterol levels are down to 180 mg/dL!",
    "Prescribed 10mg Lisinopril for high blood pressure",
    "Had an asthma attack last night, used inhaler twice",
    "Fasting blood sugar measured at 110 mg/dL this morning"
];

export default function Esiwell() {
    const [note, setNote] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollContainerRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!note.trim()) return;

        setLoading(true);
        // Zero-Input Demo logic: Simulate a response if backend isn't ready
        try {
            const response = await apiClient.post('/esiwell/compile', { text: note }).catch(() => null);

            if (response && response.status === 200) {
                setResult(response.data);
            } else {
                // Dummy data fallback for demo
                await new Promise(resolve => setTimeout(resolve, 1200));
                setResult({
                    prediction: "Medication Logged",
                    confidence: 0.94
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-12 px-4 relative z-10 flex flex-col gap-12 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-primary tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                    EsiWell <span className="font-primary italic drop-shadow-sm font-light">Compiler</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mt-2 font-primary">
                    Translate your free-form health notes into structured medical memory instantly.
                </p>
            </div>

            {/* Scrollable Prompts Carousel */}
            <div className="w-full overflow-hidden relative">
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide snap-x"
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <div 
                            key={idx}
                            role="button"
                            tabIndex={0}
                            onClick={() => setNote(prompt)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setNote(prompt);
                                }
                            }}
                            className="shrink-0 w-72 p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-2xl group relative cursor-pointer snap-start"
                        >
                            <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                            <div className="h-full bg-background/40 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/5 relative overflow-hidden transition-all duration-300 group-hover:bg-white/5 group-hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(255,69,51,0.15)] group-hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                                <p className="text-sm font-primary text-text/80 group-hover:text-text transition-colors line-clamp-3 leading-relaxed">
                                    "{prompt}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Container with Liquid Glass */}
            <div className="p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-3xl w-full group relative">
                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                <div className="bg-background/40 backdrop-blur-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden transition-colors">
                    
                    <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="note" className="text-sm font-medium text-text/80 uppercase tracking-widest ml-1 font-primary">
                                Clinical Note
                            </label>
                            <textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g., Started taking 500mg Metformin twice daily with meals..."
                                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-text placeholder-text/30 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all resize-none backdrop-blur-xl font-primary leading-relaxed shadow-inner"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || !note.trim()}
                            className="self-end px-8 py-3 rounded-full bg-gradient-to-r from-brand-primary to-accent text-white text-sm font-primary font-bold hover:shadow-[0_0_15px_rgba(255,69,51,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wide"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Compiling...
                                </>
                            ) : (
                                "Compile Signal"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Container with Liquid Glass */}
            {result && (
                <div className="p-[1px] bg-gradient-to-b from-brand-primary/50 to-transparent rounded-3xl w-full animate-slide-up group relative">
                    <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                    <div className="bg-background/60 backdrop-blur-3xl rounded-3xl p-6 md:p-8 shadow-2xl border border-brand-primary/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-center text-center">
                        <div className="flex flex-col gap-2 relative z-10">
                            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest font-primary">
                                Detected Event
                            </span>
                            <span className="text-2xl font-primary font-medium text-white">
                                {result.prediction}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
