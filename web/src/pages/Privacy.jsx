import React from 'react';
import GlassCard from '../components/GlassCard';

export default function Privacy() {
    return (
        <div className="w-full min-h-screen pt-20 pb-32 px-6 flex flex-col items-center relative z-20">
            <div className="w-full max-w-4xl space-y-12 animate-fade-in-up">
                
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                        Privacy <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <blockquote className="text-xl md:text-2xl text-text-muted font-medium italic border-l-4 border-brand-primary pl-6 mx-auto max-w-3xl text-left font-primary">
                        "At Esillio OS, your privacy is a foundational engineering principle. We store your data securely in the cloud with strict access controls, ensuring compliance with global data protection standards."
                    </blockquote>
                </div>

                <GlassCard className="p-8 md:p-12 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Secure Cloud Architecture</h2>
                        <p className="text-text-muted leading-relaxed">
                            Esillio OS securely stores your health data in our dedicated cloud infrastructure (powered by Supabase). All data is encrypted in transit using TLS/SSL and encrypted at rest. We utilize strict Row-Level Security (RLS) to guarantee that only you, and the individuals you explicitly authorize, can access your timeline and insights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. DPDP Act (India) Compliance</h2>
                        <p className="text-text-muted leading-relaxed">
                            In compliance with the Digital Personal Data Protection Act (DPDP), Esillio acts as a Data Fiduciary. By using our services, you grant explicit consent for us to process your health records strictly for the purpose of generating health timelines and AI insights. You have the right to access, correct, and completely erase your personal data at any time via your account settings. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. GDPR (Europe) Compliance</h2>
                        <p className="text-text-muted leading-relaxed">
                            For users in the European Union, we adhere to the General Data Protection Regulation (GDPR). You possess the "Right to be Forgotten" (complete data erasure) and the right to Data Portability (exporting your timeline in a machine-readable format). We process your health data under the legal basis of explicit consent and legitimate interest in providing the core application functionality.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. Artificial Intelligence & Third Parties</h2>
                        <p className="text-text-muted leading-relaxed">
                            To generate intelligent insights, Esillio OS securely transmits isolated segments of your data to specialized Large Language Model (LLM) APIs (e.g., OpenAI). Your data is utilized strictly for inference to provide you with insights and is not used to train public foundation models.
                        </p>
                    </section>
                </GlassCard>

                <div className="text-center">
                    <p className="text-text-muted text-sm">Last Updated: August 2026</p>
                </div>
            </div>
        </div>
    );
}
