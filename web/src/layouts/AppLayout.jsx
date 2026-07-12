import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background from "../components/Background";

export default function AppLayout({ children }) {
    return (
        <div className="relative min-h-screen text-text selection:bg-accent/30 flex flex-col overflow-x-hidden">
            <Background />

            <div className="relative z-10 flex flex-col flex-1">
                <Navbar />

                <main className="w-full max-w-[1320px] mx-auto px-6 pt-32 pb-20 flex-1">
                    {children}
                </main>
                
                {/* Footer Liquid Motif with Subtle Wordmark */}
                <div className="relative w-full h-[250px] flex items-end justify-center group mt-auto cursor-default overflow-hidden">
                    {/* Top masking gradient to ensure absolutely no banding with the page above */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>

                    {/* Gradient blooms - smooth fade */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,69,51,0.08),rgba(138,43,226,0.05),transparent_70%)] blur-[60px] transition-all duration-[1.5s] ease-out group-hover:scale-[1.15] group-hover:opacity-100 opacity-70"></div>
                    <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06),transparent_70%)] blur-[40px] transition-all duration-1000 ease-out group-hover:scale-[1.2] group-hover:opacity-100 opacity-50"></div>
                    
                    {/* Subtle Glass Wordmark */}
                    <div className="relative z-20 mb-[-15px] sm:mb-[-25px] opacity-15 mix-blend-overlay flex justify-center transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:opacity-40 group-hover:blur-[1px] group-hover:tracking-[0.15em] group-hover:scale-105 select-none">
                        <span className="font-primary text-[100px] sm:text-[180px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-t from-white/60 via-white/10 to-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.04)' }}>
                            Esillio
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}