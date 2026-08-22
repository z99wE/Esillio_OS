import { useState } from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";
import { Link, useNavigate } from "react-router-dom";

export default function Waitlist() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await fetch("/api/admin/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                setStatus("success");
                setTimeout(() => navigate("/onboarding"), 1500);
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center px-6 overflow-hidden">
            <DNABackground />
            <div className="relative z-10 w-full max-w-md animate-fade-in">
                <GlassCard className="p-8 md:p-12 border-white/10 flex flex-col gap-6 text-center shadow-[0_0_30px_rgba(138,43,226,0.15)]">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent">
                        Join the Waitlist
                    </h1>
                    <p className="text-text-secondary text-sm md:text-base">
                        Esillio OS is currently in private beta. Join the waitlist to get early access when we open up.
                    </p>
                    {status === "success" ? (
                        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl">
                            Thank you! You're on the list.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-text focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-primary to-accent-purple text-white font-bold tracking-wide hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
                            >
                                {status === "loading" ? "Joining..." : "Join Waitlist"}
                            </button>
                        </form>
                    )}
                    <Link to="/" className="text-text-secondary hover:text-white transition-colors text-sm mt-4">
                        &larr; Back to Home
                    </Link>
                </GlassCard>
            </div>
        </div>
    );
}
