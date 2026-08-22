import { useState, useEffect } from "react";
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

export default function MedicationReminders() {
    const [reminders, setReminders] = useState([]);
    const [medName, setMedName] = useState("");
    const [time, setTime] = useState("09:00");
    const [isNative, setIsNative] = useState(false);

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
        checkPermissions();
        loadPendingReminders();
    }, []);

    const checkPermissions = async () => {
        if (Capacitor.isNativePlatform()) {
            const perm = await LocalNotifications.checkPermissions();
            if (perm.display !== 'granted') {
                await LocalNotifications.requestPermissions();
            }
        } else if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    };

    const loadPendingReminders = async () => {
        if (Capacitor.isNativePlatform()) {
            const pending = await LocalNotifications.getPending();
            setReminders(pending.notifications);
        } else {
            // Mock for web
            const saved = localStorage.getItem('web_reminders');
            if (saved) {
                setReminders(JSON.parse(saved));
            }
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();
        if (!medName || !time) return;

        const id = Math.floor(Math.random() * 100000);
        const [hours, minutes] = time.split(':').map(Number);
        
        const now = new Date();
        let scheduleDate = new Date();
        scheduleDate.setHours(hours, minutes, 0, 0);
        
        if (scheduleDate < now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        if (Capacitor.isNativePlatform()) {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: "Medication Reminder",
                        body: `It's time to take your medication: ${medName}`,
                        id: id,
                        schedule: { at: scheduleDate, repeats: true, every: 'day' },
                        sound: null,
                        attachments: null,
                        actionTypeId: "",
                        extra: null
                    }
                ]
            });
        } else {
            // Web fallback
            const newReminder = { id, title: "Medication Reminder", body: `Time for ${medName}`, at: scheduleDate.toISOString() };
            const updated = [...reminders, newReminder];
            localStorage.setItem('web_reminders', JSON.stringify(updated));
            setReminders(updated);
        }

        setMedName("");
        setTime("09:00");
        loadPendingReminders();
    };

    const handleCancel = async (id) => {
        if (Capacitor.isNativePlatform()) {
            await LocalNotifications.cancel({ notifications: [{ id }] });
        } else {
            const updated = reminders.filter(r => r.id !== id);
            localStorage.setItem('web_reminders', JSON.stringify(updated));
            setReminders(updated);
        }
        loadPendingReminders();
    };

    return (
        <div className="w-full flex flex-col gap-8 animate-fade-in-up pb-24">
            <PageHeader 
                title="Local Medication Reminders" 
                subtitle="Scheduled entirely on your device. Zero cloud compute required, ensuring total privacy."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-text-primary">Add Reminder</h2>
                    <form onSubmit={handleAddReminder} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                                Medication Name
                            </label>
                            <input
                                type="text"
                                value={medName}
                                onChange={(e) => setMedName(e.target.value)}
                                placeholder="e.g. Lisinopril 10mg"
                                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                                Time (Daily)
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary focus:outline-none focus:border-brand-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 mt-2 bg-brand-primary text-text-primary rounded-md font-medium hover:bg-brand-primary/80 transition-colors"
                        >
                            Schedule on Device
                        </button>
                    </form>
                </GlassCard>

                <GlassCard className="p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-text-primary flex items-center justify-between">
                        Active Reminders
                        {!isNative && <span className="text-xs bg-white/10 px-2 py-1 rounded text-text-secondary font-normal">Web Preview</span>}
                    </h2>
                    
                    {reminders.length === 0 ? (
                        <div className="text-text-secondary text-sm italic">
                            No local reminders scheduled.
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {reminders.map((r, i) => {
                                const body = r.body || r.text || "Medication";
                                return (
                                    <li key={i} className="flex justify-between items-center bg-black/30 border border-white/5 p-4 rounded-lg">
                                        <div>
                                            <h3 className="text-text-primary font-medium">{body}</h3>
                                            <p className="text-sm text-text-secondary mt-1">
                                                {isNative && r.schedule?.at 
                                                    ? new Date(r.schedule.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : r.at ? new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Daily"}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleCancel(r.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 bg-red-400/10 rounded-md transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
