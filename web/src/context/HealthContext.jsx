import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";
import { dummyPatients } from "../utils/dummyData";

const HealthContext = createContext();

export function useHealth() {
    return useContext(HealthContext);
}

export function HealthProvider({ children }) {
    const [currentPatientId, setCurrentPatientId] = useState("usr-demo-1");
    const [timeline, setTimeline] = useState([]);
    const [memory, setMemory] = useState(null);
    const [usage, setUsage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTimeline = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get("/timeline");
            if (res.data && res.data.length === 0) {
                const patient = dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
                setTimeline(patient.timeline || []);
            } else {
                setTimeline(res.data);
            }
            setError(null);
        } catch (err) {
            console.log("Backend unavailable or timeline fetch failed, falling back to dummy data.");
            const patient = dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
            setTimeline(patient.timeline || []);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMemory = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get("/memory/current");
            if (!res.data || Object.keys(res.data).length === 0) {
                const patient = dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
                setMemory(patient);
            } else {
                setMemory(res.data);
            }
            setError(null);
        } catch (err) {
            console.log("Backend unavailable or memory fetch failed, falling back to dummy data.");
            const patient = dummyPatients.find(p => p.id === currentPatientId) || dummyPatients[0];
            setMemory(patient);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsage = async () => {
        try {
            const res = await apiClient.get("/usage/current");
            setUsage(res.data?.usage || null);
        } catch {
            setUsage(null);
        }
    };

    const uploadDocument = async (file) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            
            await apiClient.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            // Refresh data after upload
            await Promise.all([fetchTimeline(), fetchMemory()]);
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.detail || "Upload failed. (If backend is offline, this is expected in Demo Mode)";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeline();
        fetchMemory();
        fetchUsage();
    }, [currentPatientId]);

    const value = React.useMemo(() => ({
        currentPatientId,
        setCurrentPatientId,
        timeline,
        memory,
        usage,
        isLoading,
        error,
        fetchTimeline,
        fetchMemory,
        fetchUsage,
        uploadDocument
    }), [currentPatientId, timeline, memory, usage, isLoading, error]);

    return (
        <HealthContext.Provider value={value}>
            {children}
        </HealthContext.Provider>
    );
}
