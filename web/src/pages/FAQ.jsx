import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";

const faqs = [
    {
        q: "What is Esillio OS?",
        a: "Esillio OS is a local-first clinical intelligence platform that helps patients and clinicians aggregate, analyze, and track health history longitudinally."
    },
    {
        q: "Is my data sent to the cloud?",
        a: "By default, your health records stay on your local device. If you opt-in to use advanced AI models (like OpenAI or Anthropic), your data is sent securely only for the duration of the request."
    },
    {
        q: "Can I share my records with my doctor?",
        a: "Yes! You can create secure, expiring share links or invite your clinician directly to view your parsed health timeline."
    },
    {
        q: "Is Esillio a replacement for my doctor?",
        a: "No. Esillio is an educational clinical intelligence tool. It does not diagnose, treat, or cure diseases. Always consult your licensed healthcare provider."
    }
];

export default function FAQ() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent mb-8 text-center">
                    Frequently Asked Questions
                </h1>
                <div className="flex flex-col gap-6">
                    {faqs.map((faq, i) => (
                        <GlassCard key={i} className="p-6 border-white/5 hover:border-brand-primary/30 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
                            <p className="text-text-secondary leading-relaxed">{faq.a}</p>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    );
}
