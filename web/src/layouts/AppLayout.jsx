import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Background from "../components/Background";

export default function AppLayout({ children }) {
    return (
        <div className="relative min-h-screen text-text selection:bg-accent/30">
            <Background />

            <div className="relative z-10 flex flex-col">
                <Navbar />

                <main className="w-full max-w-[1320px] mx-auto px-6 pt-32 pb-20">
                    {children}
                </main>
            </div>
        </div>
    );
}