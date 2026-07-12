import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background from "../components/Background";

export default function AppLayout({ children }) {
    return (
        <div className="relative min-h-screen text-text selection:bg-accent/30">
            <Background />

            <div className="relative z-10 flex flex-col">
                <Navbar />

                <main className="w-full max-w-[1320px] mx-auto px-6 pt-32 pb-32">
                    {children}
                </main>
            </div>
            
            {/* Bottom Gradient Motif with Subtle Wordmark */}
            <div className="fixed bottom-0 left-0 w-full pointer-events-none z-[100] h-48 flex items-end justify-center overflow-hidden">
                {/* Gradient fade */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,69,51,0.15),rgba(138,43,226,0.1),transparent_70%)] blur-[40px]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-[radial-gradient(ellipse_at_bottom,rgba(0,229,255,0.15),transparent_70%)] blur-[20px]"></div>
                
                {/* Subtle Glass Wordmark */}
                <div className="relative mb-[-10px] sm:mb-[-15px] opacity-20 mix-blend-overlay flex justify-center">
                    <span className="font-primary text-[80px] sm:text-[140px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-t from-white/60 to-white/0" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        Esillio
                    </span>
                </div>
            </div>
        </div>
    );
}