import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";
import { Link } from "react-router-dom";
import { Users, FileText, Settings, Activity, Calendar, CheckCircle, Bell } from "lucide-react";

export default function ClinicianWorkspace() {
    const [patients, setPatients] = useState([]);
    
    useEffect(() => {
        setPatients([
            { id: "patient-1", name: "Jane Doe", lastUpdated: "2 hours ago", status: "Needs Review", alert: true, condition: "Hypertension", lastVisit: "Oct 12" },
            { id: "patient-2", name: "John Smith", lastUpdated: "1 day ago", status: "Stable", alert: false, condition: "Type 2 Diabetes", lastVisit: "Sep 28" },
            { id: "patient-3", name: "Maria Garcia", lastUpdated: "3 days ago", status: "Pending Education", alert: false, condition: "Asthma", lastVisit: "Nov 01" },
        ]);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />
            <div className="flex max-w-screen-2xl mx-auto border-t border-white/10 mt-16 min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-64 border-r border-white/10 hidden md:block p-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Main Menu</div>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-brand-primary/10 text-brand-primary font-medium">
                            <Users size={18} /> Patients
                        </button>
                        <Link to="/clinician-queue" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                            <FileText size={18} /> Education Queue
                        </Link>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                            <Activity size={18} /> Insights
                        </button>
                        <button className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                            <div className="flex items-center gap-3"><Bell size={18} /> Alerts</div>
                            <span className="bg-brand-primary text-white text-xs px-2 py-0.5 rounded-full">1</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 px-6 md:px-10 py-8 animate-fade-in overflow-y-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent">
                                Patient Overview
                            </h1>
                            <p className="text-text-secondary mt-1">Manage your active patient cohort and review alerts.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 border border-white/20 hover:bg-white/5 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                <Calendar size={16} /> Schedule
                            </button>
                            <button className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                                <Users size={16} /> Add Patient
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {patients.map(patient => (
                            <GlassCard key={patient.id} className="p-0 border-white/10 flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-white/5 relative">
                                    {patient.alert && (
                                        <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                    )}
                                    <h3 className="text-xl font-bold text-white mb-1">{patient.name}</h3>
                                    <p className="text-sm text-text-secondary">{patient.condition}</p>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-secondary">Status:</span>
                                        <span className={`font-medium ${patient.alert ? "text-red-400" : patient.status === "Pending Education" ? "text-yellow-400" : "text-brand-primary"}`}>
                                            {patient.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-secondary">Last updated:</span>
                                        <span className="text-white">{patient.lastUpdated}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-secondary">Last visit:</span>
                                        <span className="text-white">{patient.lastVisit}</span>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex gap-2">
                                    <Link to={`/patient/${patient.id}`} className="flex-1 py-2 text-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium">
                                        View Record
                                    </Link>
                                    {patient.status === "Pending Education" && (
                                        <button className="flex-1 py-2 text-center bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1">
                                            <CheckCircle size={14} /> Review
                                        </button>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
