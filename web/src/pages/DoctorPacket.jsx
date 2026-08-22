import { useRef } from "react";
import { useHealth } from "../context/HealthContext";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

export default function DoctorPacket() {
    const { memory } = useHealth();
    const printRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full flex flex-col gap-8 animate-fade-in-up pb-24">
            {/* Header hidden during print */}
            <div className="print:hidden">
                <PageHeader 
                    title="One-Click Doctor Packet" 
                    subtitle="Generates a clinical summary locally on your device for your next doctor's visit."
                />
            </div>

            <div className="print:hidden flex justify-end">
                <button
                    onClick={handlePrint}
                    className="bg-brand-primary text-text-primary px-6 py-2.5 rounded-sm font-medium hover:bg-brand-primary/80 transition-colors shadow-lg"
                >
                    Print to PDF
                </button>
            </div>

            {/* Document that will be printed */}
            <div ref={printRef} className="print:m-0 print:p-0 print:bg-white print:text-black">
                <GlassCard className="p-8 space-y-8 print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none">
                    
                    <div className="border-b border-white/10 print:border-black/20 pb-6 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-primary font-bold text-text-primary print:text-black">
                                Clinical Summary Packet
                            </h1>
                            <p className="text-text-secondary print:text-gray-600 mt-2">
                                Patient: {memory?.name || "Unknown"}
                            </p>
                        </div>
                        <div className="text-right text-text-secondary print:text-gray-600 text-sm">
                            <p>DOB: {memory?.demographics?.dob || "N/A"}</p>
                            <p>Generated: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
                        <div>
                            <h2 className="text-brand-primary print:text-black font-semibold uppercase tracking-wider text-sm mb-4">
                                Active Medications
                            </h2>
                            {memory?.medications?.length > 0 ? (
                                <ul className="space-y-3">
                                    {memory.medications.map((med, i) => (
                                        <li key={i} className="bg-black/30 print:bg-transparent print:border-b print:border-gray-200 p-3 rounded-md print:rounded-none">
                                            <p className="font-medium text-text-primary print:text-black">{med.name}</p>
                                            <p className="text-sm text-text-secondary print:text-gray-600">Dosage: {med.dosage}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-text-muted print:text-gray-500 italic">No active medications recorded.</p>
                            )}
                        </div>

                        <div>
                            <h2 className="text-accent-blue print:text-black font-semibold uppercase tracking-wider text-sm mb-4">
                                Allergies & Alerts
                            </h2>
                            {memory?.allergies?.length > 0 ? (
                                <ul className="space-y-3">
                                    {memory.allergies.map((allergy, i) => (
                                        <li key={i} className="flex items-center gap-2 text-text-primary print:text-black bg-black/30 print:bg-transparent print:border-b print:border-gray-200 p-3 rounded-md print:rounded-none">
                                            <span className="text-red-400 print:text-black font-bold">⚠</span>
                                            {allergy}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-text-muted print:text-gray-500 italic">No known allergies.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 print:border-black/20">
                        <h2 className="text-accent-purple print:text-black font-semibold uppercase tracking-wider text-sm mb-4">
                            Recent Clinical Events
                        </h2>
                        {memory?.timeline?.length > 0 ? (
                            <div className="space-y-4">
                                {memory.timeline.slice(0, 5).map((event, i) => (
                                    <div key={i} className="border-l-2 border-brand-primary print:border-black pl-4 py-1">
                                        <p className="text-sm text-text-secondary print:text-gray-500 mb-1">{event.date}</p>
                                        <p className="font-medium text-text-primary print:text-black">{event.title}</p>
                                        <p className="text-sm text-text-muted print:text-gray-600 mt-1">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-muted print:text-gray-500 italic">No recent timeline events found.</p>
                        )}
                    </div>
                    
                    <div className="mt-12 text-center text-xs text-text-muted print:text-gray-400">
                        Generated locally by Esillio • Not a substitute for professional medical advice.
                    </div>
                </GlassCard>
            </div>
            
            <style>{`
                @media print {
                    @page { margin: 1cm; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
}
