import { useLocation, Link } from "react-router-dom";
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
                <div className="relative w-full h-[400px] flex flex-col items-center justify-end group mt-auto cursor-default overflow-hidden">
                    {/* Vibrant Orangeish Pop at the extreme bottom - Opacity 15% */}
                    <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,120,0,0.15),rgba(255,60,0,0.05),transparent_70%)] blur-[50px] transition-all duration-[2s] ease-out group-hover:scale-[1.15] group-hover:opacity-100 opacity-50 pointer-events-none z-0"></div>
                    <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.1),transparent_60%)] blur-[80px] transition-all duration-[2s] ease-out group-hover:scale-[1.1] pointer-events-none z-0"></div>
                    
                    {/* Sharp, Distanced Liquid Glass Wordmark - 10% Opacity Base with Z-axis fade up */}
                    <div className="relative z-20 w-full flex justify-center transition-all duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:tracking-[0.05em] select-none pb-4 transform-gpu scale-95 translate-y-8 group-hover:scale-100 group-hover:translate-y-0">
                        <span className="font-primary text-[20vw] md:text-[220px] leading-none font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white/40 via-white/10 to-transparent opacity-10 transition-all duration-[1.5s] group-hover:opacity-100 group-hover:from-white group-hover:via-white/50 group-hover:to-white/10 group-hover:drop-shadow-[0_0_20px_rgba(255,120,0,0.3)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                            Esillio
                        </span>
                    </div>

                    {/* Legal Links Footer */}
                    <div className="relative z-30 w-full max-w-[1320px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between border-t border-white/5 text-sm text-text-muted mt-8 transition-opacity duration-1000 opacity-50 group-hover:opacity-100">
                        <p>© {new Date().getFullYear()} Esillio OS. Local-First Native Application.</p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
                            <Link to="/disclaimer" className="hover:text-white transition-colors duration-300">Medical Disclaimer</Link>
                            <Link to="/legal" className="hover:text-white transition-colors duration-300">Legal & Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}