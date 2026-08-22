import { useState, useEffect } from "react";
import client from "../api/client";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import ReactMarkdown from "react-markdown";

export default function EducationCards() {
    const { user } = useAuth();
    const isClinician = user?.role === "clinician";
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchCards = async () => {
        try {
            setLoading(true);
            const res = await client.get("/education/");
            setCards(res.data.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleApprove = async (id) => {
        try {
            await client.patch(`/education/${id}`, { status: "approved" });
            fetchCards();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight pb-2 leading-tight text-white">
                    Education <span className="font-primary italic drop-shadow-sm bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Cards</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4">
                    {isClinician ? "Review and approve generated education material." : "Personalized educational content about your conditions."}
                </p>
            </div>
            
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : cards.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-text-secondary text-lg">No education cards found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map(c => (
                        <GlassCard key={c.id}>
                            <div className="p-6 flex flex-col h-full gap-4">
                                <div>
                                    <h3 className="text-xl font-medium text-white">{c.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full border ${c.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                            {c.status}
                                        </span>
                                        <span className="text-xs text-text-secondary">{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="prose prose-invert prose-sm overflow-y-auto max-h-64 bg-white/5 p-4 rounded-xl border border-white/10 flex-1 custom-scrollbar">
                                    <ReactMarkdown>{c.content_md}</ReactMarkdown>
                                </div>
                                {isClinician && c.status === "draft" && (
                                    <button onClick={() => handleApprove(c.id)} className="mt-2 px-4 py-2 bg-green-500/20 text-green-400 font-medium rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30">
                                        Approve Content
                                    </button>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
