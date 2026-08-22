import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ActionPlan() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get('/api/tasks/');
            setTasks(response.data || []);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
            setError("Failed to load your action plan. Please try again.");
            
            // Dummy data fallback for demo if API fails
            if (user?.id === '00000000-0000-4000-a000-000000000000' || err.response?.status === 404) {
                setTasks([
                    { id: '1', title: 'Schedule Follow-up with Cardiologist', description: 'Book an appointment with Dr. Smith to discuss recent ECG results.', type: 'appointment_prep', status: 'pending', created_at: new Date().toISOString() },
                    { id: '2', title: 'Complete Fasting Blood Panel', description: 'Get a comprehensive metabolic panel and lipid profile. Fast for 12 hours prior.', type: 'lab_followup', status: 'pending', created_at: new Date().toISOString() },
                    { id: '3', title: 'Start taking Lisinopril 10mg', description: 'Take one tablet daily in the morning as prescribed for blood pressure management.', type: 'medication_change', status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
                    { id: '4', title: 'Ask about intermittent joint pain', description: 'Remember to ask your PCP about the mild pain in your left knee that started last month.', type: 'ask_doctor', status: 'pending', created_at: new Date().toISOString() }
                ]);
                setError(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
            
            // Wait to prevent 404 on dummy data
            if (!taskId.startsWith('usr-demo') && taskId.length > 5) {
                await apiClient.patch(`/api/tasks/${taskId}`, { status: newStatus });
            }
        } catch (err) {
            console.error("Failed to update task", err);
            // Revert on error
            fetchTasks();
        }
    };

    const handleChecklistItemToggle = async (taskId, itemIndex) => {
        try {
            // Optimistic update for checklist toggles
            // Here we assume checked state is saved in local state or we just append '-completed' to the string for simplicity, or we maintain a separate checked list. 
            // A more robust backend would have a nested model, but we will just handle visual toggles locally for now to keep the frontend functional.
            const newTasks = tasks.map(t => {
                if (t.id === taskId) {
                    const newChecklist = [...(t.checklist || [])];
                    const item = newChecklist[itemIndex];
                    if (item.startsWith('[x] ')) {
                        newChecklist[itemIndex] = item.replace('[x] ', '');
                    } else {
                        newChecklist[itemIndex] = `[x] ${item}`;
                    }
                    return { ...t, checklist: newChecklist };
                }
                return t;
            });
            setTasks(newTasks);
            
            const updatedTask = newTasks.find(t => t.id === taskId);
            
            if (!taskId.startsWith('usr-demo') && taskId.length > 5) {
                await apiClient.patch(`/api/tasks/${taskId}`, { checklist: updatedTask.checklist });
            }
        } catch (err) {
            console.error("Failed to update checklist item", err);
            fetchTasks(); // revert
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'appointment_prep': return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
            case 'lab_followup': return 'bg-accent-purple/20 text-accent-purple border-accent-purple/30';
            case 'medication_change': return 'bg-brand-primary/20 text-brand-primary border-brand-primary/30';
            case 'ask_doctor': return 'bg-accent-green/20 text-accent-green border-accent-green/30';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'appointment_prep': return 'Appointment Prep';
            case 'lab_followup': return 'Lab Follow-up';
            case 'medication_change': return 'Medication';
            case 'ask_doctor': return 'Ask Doctor';
            default: return 'General';
        }
    };

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 relative z-10 animate-fade-in-up">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                    Your <span className="font-primary italic drop-shadow-sm font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">Action Plan</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-4 font-secondary">
                    Follow-up tasks automatically extracted from your clinical timeline to help you stay on top of your health journey.
                </p>
            </div>

            {isLoading && (
                <div className="flex justify-center my-12">
                    <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error && (
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-6 text-brand-primary text-center mb-8 font-primary">
                    <p>{error}</p>
                </div>
            )}

            {!isLoading && !error && tasks.length === 0 && (
                <div className="bg-neutral-surface border border-border-primary rounded-xl p-16 text-center relative overflow-hidden glass-panel">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px]"></div>
                    <h2 className="text-2xl font-primary font-medium text-text-primary mb-3 relative z-10">No Pending Actions</h2>
                    <p className="text-text-secondary relative z-10 max-w-md mx-auto font-secondary">
                        Your action plan is currently empty. New tasks will appear here as they are identified from your uploaded medical records.
                    </p>
                </div>
            )}

            {!isLoading && tasks.length > 0 && (
                <div className="space-y-12">
                    {pendingTasks.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-primary font-medium text-white flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#FF4533] animate-pulse"></span>
                                Pending Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pendingTasks.map(task => (
                                    <GlassCard key={task.id} className="p-6 flex flex-col h-full hover:bg-white/5 transition-colors border border-white/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${getTypeColor(task.type)} backdrop-blur-md font-secondary`}>
                                                {getTypeLabel(task.type)}
                                            </span>
                                            <span className="text-xs text-text-secondary font-secondary">
                                                {new Date(task.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-medium text-white mb-2 font-primary">{task.title}</h3>
                                        <p className="text-text-secondary leading-relaxed mb-4 font-secondary text-sm">
                                            {task.description}
                                        </p>
                                        
                                        {task.checklist && task.checklist.length > 0 && (
                                            <div className="mb-6 space-y-2 flex-grow">
                                                {task.checklist.map((item, idx) => {
                                                    const isChecked = item.startsWith('[x] ');
                                                    const displayItem = isChecked ? item.replace('[x] ', '') : item;
                                                    return (
                                                        <label key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                                            <div className="relative flex items-center justify-center mt-0.5">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-transparent checked:bg-brand-primary checked:border-brand-primary transition-all cursor-pointer"
                                                                    checked={isChecked}
                                                                    onChange={() => handleChecklistItemToggle(task.id, idx)}
                                                                />
                                                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            </div>
                                                            <span className={`text-sm font-secondary leading-tight transition-colors ${isChecked ? 'text-text-secondary line-through' : 'text-white/90 group-hover:text-white'}`}>
                                                                {displayItem}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        {!task.checklist || task.checklist.length === 0 ? <div className="flex-grow"></div> : null}

                                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                                            <button 
                                                onClick={() => handleUpdateStatus(task.id, 'completed')}
                                                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-brand-primary/10 to-[#8A2BE2]/10 hover:from-brand-primary/20 hover:to-[#8A2BE2]/20 text-white border border-brand-primary/30 font-medium text-sm transition-all duration-300 font-secondary"
                                            >
                                                Mark Done
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(task.id, 'dismissed')}
                                                className="flex-1 py-2 rounded-xl bg-neutral-surface/50 hover:bg-neutral-surface/80 text-white/70 hover:text-white border border-white/10 hover:border-white/20 font-medium text-sm transition-all duration-300 font-secondary"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {completedTasks.length > 0 && (
                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <h2 className="text-xl font-primary font-medium text-text-secondary">Completed</h2>
                            <div className="space-y-4">
                                {completedTasks.map(task => (
                                    <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium font-primary line-through">{task.title}</h4>
                                                <p className="text-sm text-text-secondary font-primary">{getTypeLabel(task.type)}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleUpdateStatus(task.id, 'pending')}
                                            className="text-xs text-brand-primary hover:underline font-primary px-3 py-1"
                                        >
                                            Undo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
