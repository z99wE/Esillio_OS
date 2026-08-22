import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";

export default function AdminConsole() {
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                const token = localStorage.getItem("access_token") || "guest-token-123";
                const response = await fetch("/api/admin/metrics", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error("Admin access denied");
                }
                
                const data = await response.json();
                setMetrics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMetrics();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-6 py-24 animate-fade-in">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent mb-8">
                    Esillio OS Admin Console
                </h1>

                {loading && <p>Loading metrics...</p>}
                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-8">{error}</div>}
                
                {metrics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <GlassCard className="p-6 border-white/10">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Total Users</h3>
                            <p className="text-4xl font-bold text-white">{metrics.total_users}</p>
                        </GlassCard>
                        <GlassCard className="p-6 border-white/10">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Daily Active</h3>
                            <p className="text-4xl font-bold text-white">{metrics.daily_active_users}</p>
                        </GlassCard>
                        <GlassCard className="p-6 border-white/10">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">API Tokens Consumed</h3>
                            <p className="text-4xl font-bold text-brand-primary">{metrics.total_tokens_consumed.toLocaleString()}</p>
                        </GlassCard>
                        <GlassCard className="p-6 border-white/10">
                            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Waitlist Count</h3>
                            <p className="text-4xl font-bold text-white">{metrics.waitlist_count}</p>
                        </GlassCard>
                    </div>
                )}

                {metrics && (
                    <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Cohort Retention (Weekly)</h2>
                        <GlassCard className="p-6 border-white/10 overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="text-text-secondary text-sm border-b border-white/10">
                                        <th className="py-3 px-4 font-medium">Cohort</th>
                                        <th className="py-3 px-4 font-medium">Size</th>
                                        <th className="py-3 px-4 font-medium">Week 0</th>
                                        <th className="py-3 px-4 font-medium">Week 1</th>
                                        <th className="py-3 px-4 font-medium">Week 2</th>
                                        <th className="py-3 px-4 font-medium">Week 3</th>
                                        <th className="py-3 px-4 font-medium">Week 4</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[
                                        { date: 'Jul 01 - Jul 07', size: 145, data: [100, 85, 78, 65, 60] },
                                        { date: 'Jul 08 - Jul 14', size: 210, data: [100, 88, 80, 71, null] },
                                        { date: 'Jul 15 - Jul 21', size: 180, data: [100, 92, 85, null, null] },
                                        { date: 'Jul 22 - Jul 28', size: 260, data: [100, 95, null, null, null] },
                                        { date: 'Jul 29 - Aug 04', size: 310, data: [100, null, null, null, null] },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-medium text-white">{row.date}</td>
                                            <td className="py-3 px-4 text-text-secondary">{row.size}</td>
                                            {row.data.map((val, j) => (
                                                <td key={j} className="py-2 px-2">
                                                    {val !== null ? (
                                                        <div 
                                                            className="rounded flex items-center justify-center py-2 px-1 font-bold text-xs" 
                                                            style={{ 
                                                                backgroundColor: `rgba(138, 43, 226, ${val / 100})`,
                                                                color: val > 60 ? '#fff' : 'rgba(255,255,255,0.7)'
                                                            }}
                                                        >
                                                            {val}%
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-8 rounded bg-white/5"></div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </GlassCard>
                    </div>
                )}
            </main>
        </div>
    );
}
