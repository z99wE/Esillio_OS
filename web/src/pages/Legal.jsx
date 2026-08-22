import React from 'react';
import GlassCard from '../components/GlassCard';

export default function Legal() {
    return (
        <div className="w-full min-h-screen pt-20 pb-32 px-6 flex flex-col items-center relative z-20">
            <div className="w-full max-w-4xl space-y-12 animate-fade-in-up">
                
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                        Legal & <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Terms of Service</span>
                    </h1>
                    <blockquote className="text-xl md:text-2xl text-text-muted font-medium italic border-l-4 border-brand-secondary pl-6 mx-auto max-w-3xl text-left font-primary">
                        "By utilizing Esillio OS, you agree to a Software-as-a-Service (SaaS) premise that securely manages your data in the cloud, while acknowledging the inherent risks of automated AI intelligence."
                    </blockquote>
                </div>

                <GlassCard className="p-8 md:p-12 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">1. Service "As Is"</h2>
                        <p className="text-text-muted leading-relaxed">
                            Esillio OS and all associated cloud services are provided "AS IS" and "AS AVAILABLE," without warranty of any kind, express or implied. We do not guarantee that the software will be uninterrupted, error-free, or entirely secure from unauthorized access, despite our enterprise-grade cloud security measures.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">2. User Provided APIs & Keys</h2>
                        <p className="text-text-muted leading-relaxed">
                            Esillio OS may require you to provide your own API keys (e.g., OpenAI API) to function fully. You agree that you are solely responsible for the security of your API keys, any usage costs incurred by those APIs, and compliance with the Terms of Service of the respective AI providers. Esillio OS does not intercept or log your API keys centrally.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">3. Intellectual Property</h2>
                        <p className="text-text-muted leading-relaxed">
                            The architecture, UI/UX design, brand identity (including the Esillio name and logos), and proprietary orchestration logic (Biological Continuity Compiler™) remain the exclusive intellectual property of Esillio. Subscribing to the platform grants you a non-exclusive license to use the software, not ownership of the underlying code.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">4. Indemnification</h2>
                        <p className="text-text-muted leading-relaxed">
                            You agree to indemnify, defend, and hold harmless the creators of Esillio OS from any claims, damages, liabilities, and expenses arising from your use of the software, your violation of these Terms, or your violation of any third-party rights, particularly concerning the uploading or processing of third-party health data to our cloud infrastructure without their explicit consent.
                        </p>
                    </section>
                </GlassCard>
            </div>
        </div>
    );
}
