import { useEffect, useState } from "react";
import { getUsage } from "../api/settings";

/**
 * UsageMeter — shows the user's daily credit consumption.
 *
 * Props:
 *   onSetupBYOK — callback to scroll / open the BYOK section
 *   byokActive  — boolean, hide the CTA if BYOK is already configured
 *   refreshKey  — change to force a re-fetch
 */
export default function UsageMeter({ onSetupBYOK, byokActive = false, refreshKey = 0 }) {
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const data = await getUsage();
                if (!cancelled) setUsage(data.usage);
            } catch {
                /* silently fail */
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="flex items-center gap-3 animate-pulse">
                <div className="h-2 flex-1 rounded-full bg-white/10" />
                <span className="text-xs text-text-secondary/40">Loading usage…</span>
            </div>
        );
    }

    if (!usage) return null;

    const { credits_used, daily_limit, credits_remaining, cost_usd } = usage;
    const pct = daily_limit > 0 ? Math.min((credits_used / daily_limit) * 100, 100) : 0;

    let barColor = "bg-gradient-to-r from-[#00E5FF] to-[#0055FF]";
    if (pct >= 100) barColor = "bg-gradient-to-r from-[#FF4533] to-[#8A2BE2]";
    else if (pct >= 80) barColor = "bg-gradient-to-r from-[#FF8C00] to-[#FF4533]";

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>
                    {credits_used}{" "}
                    <span className="text-text-secondary/50">/ {daily_limit} credits used today</span>
                </span>
                {cost_usd > 0 && (
                    <span className="text-text-secondary/60">${cost_usd.toFixed(4)} estimated cost</span>
                )}
            </div>

            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex items-center justify-between">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                    byokActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : pct >= 100
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : pct >= 80
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-white/5 text-text-secondary border-white/10"
                }`}>
                    {byokActive
                        ? "✓ BYOK Active — Unlimited"
                        : pct >= 100
                        ? "Daily limit reached"
                        : `${credits_remaining} credits remaining`}
                </span>

                {!byokActive && pct >= 80 && onSetupBYOK && (
                    <button
                        onClick={onSetupBYOK}
                        className="text-xs text-brand-primary underline underline-offset-2 hover:text-brand-primary/80 transition-colors"
                    >
                        Add your API key →
                    </button>
                )}
            </div>

            {!byokActive && pct >= 100 && (
                <div className="rounded-md border border-red-500/30 bg-red-900/10 px-4 py-3 text-sm text-red-300 leading-relaxed">
                    <strong className="block font-semibold mb-1">Daily AI limit reached</strong>
                    You have used all {daily_limit} free credits for today. AI features are paused until midnight UTC.
                    {onSetupBYOK && (
                        <button
                            onClick={onSetupBYOK}
                            className="mt-2 block w-full text-center bg-brand-primary/80 hover:bg-brand-primary text-white font-medium text-sm py-2 rounded-sm transition-colors"
                        >
                            Add your own API key for unlimited access
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
