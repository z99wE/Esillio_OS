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
                    {/* Vibrant Orangeish Pop at the extreme bottom */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,120,0,0.25),rgba(255,60,0,0.1),transparent_70%)] blur-[50px] transition-all duration-[2s] ease-out group-hover:scale-[1.15] group-hover:opacity-100 pointer-events-none z-0"></div>
                    <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.15),transparent_60%)] blur-[80px] transition-all duration-[2s] ease-out group-hover:scale-[1.1] pointer-events-none z-0"></div>
                    
                    {/* Sharp, Distanced Liquid Glass Wordmark */}
                    <div className="relative z-20 w-full flex justify-center transition-all duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:tracking-[0.05em] group-hover:scale-[1.02] select-none pb-4">
                        <span className="font-primary text-[20vw] md:text-[220px] leading-none font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-white/50 to-white/10 opacity-90 transition-all duration-1000 group-hover:opacity-100 group-hover:drop-shadow-[0_0_20px_rgba(255,120,0,0.3)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>
                            Esillio
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}