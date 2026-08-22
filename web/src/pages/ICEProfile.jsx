import QRCode from "react-qr-code";
import { useHealth } from "../context/HealthContext";
import GlassCard from "../components/GlassCard";
import PageHeader from "../components/PageHeader";

export default function ICEProfile() {
    const { memory } = useHealth();

    const profileUrl = memory ? `https://esillio.app/ice/${memory.id}` : "https://esillio.app";

    return (
        <div className="w-full flex flex-col gap-8 animate-fade-in-up">
            <PageHeader 
                title="Emergency ICE Profile" 
                subtitle="In Case of Emergency. Save this QR code to your lock screen or print it for your wallet."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* QR Code Column */}
                <div className="md:col-span-1">
                    <GlassCard className="flex flex-col items-center justify-center gap-6">
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            <QRCode value={profileUrl} size={200} />
                        </div>
                        <p className="text-sm text-text-secondary text-center">
                            Scan to access emergency medical information.
                        </p>
                        <button className="w-full py-3 bg-brand-primary hover:bg-brand-primary/80 text-white rounded-md font-medium transition-colors">
                            Save to Camera Roll
                        </button>
                    </GlassCard>
                </div>

                {/* Profile Details Column */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <GlassCard className="p-8 space-y-6">
                        <div className="border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {memory?.name || "John Doe"}
                            </h2>
                            <p className="text-text-muted">
                                DOB: {memory?.demographics?.dob || "1980-01-01"} • Blood Type: {memory?.demographics?.bloodType || "O+"}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-brand-primary font-semibold mb-2 uppercase tracking-wide text-sm">
                                    Allergies
                                </h3>
                                <ul className="space-y-1">
                                    {memory?.allergies?.length > 0 ? (
                                        memory.allergies.map((allergy, i) => (
                                            <li key={i} className="text-white text-sm">• {allergy}</li>
                                        ))
                                    ) : (
                                        <li className="text-text-muted text-sm">None recorded</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-accent-blue font-semibold mb-2 uppercase tracking-wide text-sm">
                                    Active Medications
                                </h3>
                                <ul className="space-y-1">
                                    {memory?.medications?.length > 0 ? (
                                        memory.medications.map((med, i) => (
                                            <li key={i} className="text-white text-sm">• {med.name} ({med.dosage})</li>
                                        ))
                                    ) : (
                                        <li className="text-text-muted text-sm">None recorded</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <h3 className="text-brand-primary font-semibold mb-2 uppercase tracking-wide text-sm">
                                Emergency Contacts
                            </h3>
                            <div className="space-y-2">
                                <p className="text-white text-sm">
                                    <span className="text-text-muted">Primary:</span> Jane Doe (Spouse) - 555-0199
                                </p>
                                <p className="text-white text-sm">
                                    <span className="text-text-muted">Physician:</span> Dr. Smith - 555-0188
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
