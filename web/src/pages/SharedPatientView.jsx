import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import GlassCard from "../components/GlassCard";

export default function SharedPatientView() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [patientInfo, setPatientInfo] = useState(null);
    const [accessLevel, setAccessLevel] = useState("caregiver"); // assume for now until we fetch shares
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("timeline");

    useEffect(() => {
        fetchPatientData();
    }, [id]);

    const fetchPatientData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Check shares to see what access level we have for this patient.
            // Normally we would have an API to get patient summary if we have access.
            const res = await client.get("/api/shares");
            const receivedShares = res.data?.received_patient_shares || [];
            
            // Find the share for this specific patient
            const share = receivedShares.find(s => s.patient_id === id);
            
            if (!share) {
                setError("You do not have permission to view this patient.");
                setLoading(false);
                return;
            }

            setAccessLevel(share.access_level);
            
            // Just basic info for now
            setPatientInfo({ id });
            
        } catch (e) {
            console.error(e);
            setError("Failed to verify access.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center my-24">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto py-16 px-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 text-center mb-8 font-primary">
                    <p>{error}</p>
                    <button onClick={() => navigate("/sharing")} className="mt-4 text-brand-primary hover:underline">
                        Return to Sharing Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-16 px-4 relative z-10 animate-fade-in-up">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <button onClick={() => navigate("/sharing")} className="text-sm text-brand-primary hover:underline mb-2 flex items-center gap-1 font-secondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back
                    </button>
                    <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                        Patient <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">View</span>
                    </h1>
                    <p className="text-text-secondary mt-1 font-primary">ID: {patientInfo?.id}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                        {accessLevel} Access
                    </span>
                </div>
            </div>

            <div className="flex border-b border-white/10 mb-8 font-primary">
                <button 
                    className={`px-6 py-3 border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-brand-primary text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    Timeline
                </button>
                <button 
                    className={`px-6 py-3 border-b-2 transition-colors ${activeTab === 'action-plan' ? 'border-brand-primary text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
                    onClick={() => setActiveTab('action-plan')}
                >
                    Action Plan
                </button>
                {accessLevel !== 'summary_only' && (
                    <button 
                        className={`px-6 py-3 border-b-2 transition-colors ${activeTab === 'documents' ? 'border-brand-primary text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Documents
                    </button>
                )}
            </div>

            <div className="mt-8">
                {/* 
                  Since we are reusing existing components, we would ideally pass patient_id to them.
                  But to keep it simple, we can display a placeholder for this phase, 
                  or refactor those components to accept an optional patientId prop.
                */}
                <GlassCard className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-primary/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
                    </div>
                    <h2 className="text-xl font-primary text-white mb-2">View Data for {activeTab}</h2>
                    <p className="text-text-secondary font-primary max-w-md mx-auto">
                        In a full implementation, the Timeline, Action Plan, or Documents component would be rendered here, fetching data specifically for patient ID <code>{id}</code>.
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}
