import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getUsage } from "../api/settings";
import { useNetworkState } from "../hooks/useNetworkState";
import { useZeroAI } from "../hooks/useZeroAI";

const links = [
    { title: "Timeline", path: "/timeline" },
    { title: "Upload", path: "/upload" },
    { title: "Intelligence", path: "/health" },
    { title: "EsiWell", path: "/esiwell" },
    { title: "Emergency ICE", path: "/ice" },
    { title: "Med Reminders", path: "/med-reminders" },
    { title: "Doctor Packet", path: "/doctor-packet" },
    { title: "Connect", path: "/connect" },
    { title: "Sharing", path: "/sharing" },
    { title: "Queue", path: "/clinician-queue" },
];

export default function Navbar() {
    const [usagePct, setUsagePct] = useState(0);
    const [byokActive] = useState(false);
    const { isOnline } = useNetworkState();
    const isOffline = !isOnline;
    const { isZeroAI } = useZeroAI();
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);


    useEffect(() => {
        const load = async () => {
            try {
                const data = await getUsage();
                const u = data.usage;
                if (u && u.daily_limit > 0) {
                    setUsagePct(Math.min((u.credits_used / u.daily_limit) * 100, 100));
                }
            } catch { /* non-critical */ }
        };
        load();
    }, []);

    const showAlert = !byokActive && usagePct >= 80;

    return (
        <header className="fixed top-0 left-0 w-full z-50 py-4 sm:py-6 transform-gpu transition-transform duration-500">
            <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-center items-center">
                <div className="relative top-0 left-0 w-full md:w-auto glass-panel rounded-full p-6 md:py-3 md:px-6 flex flex-col md:flex-row items-center gap-4 shadow-xl">
                    <NavLink to="/" className="flex items-center gap-2">
                        <span className="font-primary text-xl tracking-wide text-text-primary">Esillio</span>
                    </NavLink>
                    {isOffline && (
                        <span className="text-xs px-2 py-1 bg-red-900/50 text-red-200 rounded-sm border border-red-800/50">
                            Offline Mode
                        </span>
                    )}

                    <ul className="flex flex-col md:flex-row items-center gap-0.5 mt-6 md:mt-0 md:ml-2">
                        {links.filter(link => {
                            if (isZeroAI && (link.path === "/health" || link.path === "/clinician-queue" || link.path === "/esiwell" || link.path === "/upload")) {
                                return false;
                            }
                            return true;
                        }).map((link) => (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `px-3.5 py-2 text-sm font-medium transition-colors ${
                                            isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                        }`
                                    }
                                >
                                    {link.title}
                                </NavLink>
                            </li>
                        ))}

                        {/* Settings with optional usage alert dot */}
                        <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) =>
                                    `relative px-3.5 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                                        isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                    }`
                                }
                            >
                                Settings
                                {showAlert && (
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                                    </span>
                                )}
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/subscription"
                                className={({ isActive }) =>
                                    `px-3.5 py-2 text-sm font-medium transition-colors ${
                                        isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                                    }`
                                }
                            >
                                Pro
                            </NavLink>
                        </li>
                    </ul>

                    {deferredPrompt && (
                        <button
                            onClick={async () => {
                                deferredPrompt.prompt();
                                const { outcome } = await deferredPrompt.userChoice;
                                if (outcome === 'accepted') {
                                    setDeferredPrompt(null);
                                }
                            }}
                            className="mt-4 md:mt-0 md:ml-2 bg-text-primary text-bg-primary font-medium text-sm px-4 py-2 rounded-sm hover:bg-gray-300 transition-colors w-full md:w-auto text-center"
                        >
                            Install App
                        </button>
                    )}

                    <NavLink
                        to="/upload"
                        className="mt-4 md:mt-0 md:ml-2 bg-brand-primary text-text-primary font-medium text-sm px-6 py-3 rounded-sm hover:bg-red-700 transition-colors w-full md:w-auto text-center"
                    >
                        Start Memory
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}