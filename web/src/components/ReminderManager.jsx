import { useState, useEffect } from "react";
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import GlassCard from "./GlassCard";

export default function ReminderManager() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [msg, setMsg] = useState("");
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const checkPerms = async () => {
            if (Capacitor.isNativePlatform()) {
                const perms = await LocalNotifications.checkPermissions();
                if (perms.display !== 'granted') {
                    const req = await LocalNotifications.requestPermissions();
                    setHasPermission(req.display === 'granted');
                } else {
                    setHasPermission(true);
                }
            } else {
                if ('Notification' in window) {
                    if (Notification.permission === 'granted') {
                        setHasPermission(true);
                    } else if (Notification.permission !== 'denied') {
                        const perm = await Notification.requestPermission();
                        setHasPermission(perm === 'granted');
                    }
                }
            }
        };
        checkPerms();
    }, []);

    const scheduleReminder = async () => {
        if (!title.trim() || !scheduleTime) return;
        
        try {
            const date = new Date(scheduleTime);
            if (date.getTime() <= Date.now()) {
                setMsg("Please select a future time.");
                return;
            }

            if (Capacitor.isNativePlatform()) {
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            title: title,
                            body: body || "Esillio Reminder",
                            id: new Date().getTime(),
                            schedule: { at: date },
                            sound: null,
                            attachments: null,
                            actionTypeId: "",
                            extra: null
                        }
                    ]
                });
                setMsg(`Scheduled successfully for ${date.toLocaleString()}`);
            } else {
                // Web fallback using simple timeout
                const delay = date.getTime() - Date.now();
                setTimeout(() => {
                    if (Notification.permission === 'granted') {
                        new Notification(title, { body: body || "Esillio Reminder" });
                    }
                }, delay);
                setMsg(`Web fallback: Scheduled for ${date.toLocaleString()}`);
            }
            
            setTitle("");
            setBody("");
            setScheduleTime("");
        } catch (err) {
            setMsg("Failed to schedule notification.");
            console.error(err);
        }
    };

    return (
        <GlassCard className="p-6 space-y-4">
            <div>
                <h3 className="text-lg font-bold text-white">Local Reminders</h3>
                <p className="text-sm text-text-muted mt-1">
                    Set a medication or appointment reminder. This runs securely on your device.
                </p>
                {!hasPermission && (
                    <p className="text-xs text-brand-primary mt-2">
                        ⚠️ Please enable notification permissions for reminders to work.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Reminder Title (e.g., Take Amoxicillin)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-text-primary"
                />
                <input
                    type="text"
                    placeholder="Details (Optional)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-text-primary"
                />
                <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-text-primary"
                />
                <button
                    onClick={scheduleReminder}
                    disabled={!title.trim() || !scheduleTime}
                    className="bg-brand-primary text-white py-2 rounded-md font-medium text-sm disabled:opacity-50 hover:bg-brand-primary/80 transition-colors"
                >
                    Schedule Reminder
                </button>
            </div>
            {msg && <p className="text-xs text-accent-green mt-2">{msg}</p>}
        </GlassCard>
    );
}
