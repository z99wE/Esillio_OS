import React from 'react';
import GlassCard from '../components/ui/GlassCard';

export default function Privacy() {
    return (
        <div className="w-full min-h-screen pt-20 pb-32 px-6 flex flex-col items-center relative z-20">
            <div className="w-full max-w-4xl space-y-12 animate-fade-in-up">
                
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Privacy Policy
                    </h1>
                    <blockquote className="text-xl md:text-2xl text-text-muted font-medium italic border-l-4 border-brand-primary pl-6 mx-auto max-w-3xl text-left">
                        "Esillio OS is a local-first biological operating system that stores 100% of your data on your device, ensuring total privacy and bypassing standard cloud vulnerabilities."
                    </blockquote>
                </div>

                <GlassCard className="p-8 md:p-12 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Local-First Architecture</h2>
                        <p className="text-text-muted leading-relaxed">
                            Unlike traditional cloud-based health applications, Esillio OS operates entirely locally on your device. We do not transmit, process, or store your personal data, biometric information, or chat histories on our servers. Your data belongs to you, and it remains physically on your machine within an encrypted SQLite/ChromaDB instance.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. No HIPAA Liability (Bring Your Own AI)</h2>
                        <p className="text-text-muted leading-relaxed">
                            Because Esillio OS is a local software tool that you install on your own hardware, we do not function as a "Covered Entity" or a "Business Associate" under the Health Insurance Portability and Accountability Act (HIPAA). We never have access to your Protected Health Information (PHI). By utilizing the "Bring Your Own AI" (BYOAI) architecture, any data processed by external LLM APIs (such as OpenAI or Google) is subject to the terms of your direct relationship with those providers. Esillio OS simply acts as a local conduit.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Data Collection by Esillio</h2>
                        <p className="text-text-muted leading-relaxed">
                            The only data we collect pertains to your account subscription and billing for the SaaS platform itself (e.g., your email address for account recovery, and payment processing tokens handled securely via our payment partners). We do not collect telemetric data regarding the contents of your health timeline or insights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. Your Responsibilities</h2>
                        <p className="text-text-muted leading-relaxed">
                            Since your data is stored locally, you are solely responsible for the physical security of your device, the strength of your device passwords, and maintaining adequate backups of your local Esillio database.
                        </p>
                    </section>
                </GlassCard>

                <div className="text-center">
                    <p className="text-text-muted text-sm">Last Updated: July 2026</p>
                </div>
            </div>
        </div>
    );
}
