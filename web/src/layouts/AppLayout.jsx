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
                <div className="relative w-full h-[300px] flex items-end justify-center group mt-auto cursor-default">
                    {/* Gradient blooms - smooth fade */}
                    <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.15),rgba(255,69,51,0.08),transparent_60%)] blur-[80px] transition-all duration-[2s] ease-out group-hover:scale-[1.1] group-hover:opacity-100 opacity-60 pointer-events-none"></div>
                    <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.12),transparent_60%)] blur-[40px] transition-all duration-[1.5s] ease-out group-hover:scale-[1.2] group-hover:opacity-100 opacity-40 pointer-events-none"></div>
                    
                    {/* Vibrant Liquid Glass Wordmark */}
                    <div className="relative z-20 mb-[10px] w-full flex justify-center transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:blur-[2px] group-hover:tracking-[0.1em] group-hover:scale-105 select-none">
                        <span className="font-primary text-[100px] sm:text-[160px] md:text-[200px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/90 via-white/30 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-1000" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}>
                            Esillio
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}