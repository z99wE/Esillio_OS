import React, { useState, useEffect, useRef } from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";
import UsageMeter from "../components/UsageMeter";
import {
    getAISettings,
    saveAISettings,
    deleteBYOKKey,
    testAIConnection,
    listAdminKeys,
    addAdminKey,
    deactivateAdminKey,
} from "../api/settings";

const PROVIDER_CONFIGS = {
    openai: {
        label: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4o",
        keyPlaceholder: "sk-...",
        keyLabel: "OpenAI API Key",
        needsKey: true,
        needsUrl: false,
    },
    gemini: {
        label: "Google Gemini (AI Studio)",
        baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
        model: "gemini-2.0-flash",
        keyPlaceholder: "AIza...",
        keyLabel: "Google AI Studio API Key",
        needsKey: true,
        needsUrl: false,
    },
    lightning: {
        label: "Lightning AI",
        baseUrl: "",
        model: "meta-llama/Llama-3.1-8B-Instruct",
        keyPlaceholder: "Your Lightning AI API token",
        keyLabel: "Lightning AI API Token",
        needsKey: true,
        needsUrl: true,
        urlLabel: "Lightning Inference URL",
        urlPlaceholder: "https://your-studio-endpoint/v1",
    },
    custom: {
        label: "Local / Custom (Ollama, LM Studio)",
        baseUrl: "http://localhost:11434/v1",
        model: "llama3",
        keyPlaceholder: "Leave blank for Ollama",
        keyLabel: "API Key (optional)",
        needsKey: false,
        needsUrl: true,
        urlLabel: "Inference URL",
        urlPlaceholder: "http://localhost:11434/v1",
    },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Admin Key Pool Panel                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

function AdminKeyPool() {
    const [keys, setKeys] = useState([]);
    const [newProvider, setNewProvider] = useState("openai");
    const [newKey, setNewKey] = useState("");
    const [adding, setAdding] = useState(false);
    const [msg, setMsg] = useState("");

    const load = async () => {
        try {
            const res = await listAdminKeys();
            setKeys(res.keys || []);
        } catch {
            setMsg("Failed to load admin keys.");
        }
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async () => {
        if (!newKey.trim()) return;
        setAdding(true);
        setMsg("");
        try {
            await addAdminKey({ provider: newProvider, api_key: newKey.trim() });
            setNewKey("");
            setMsg("Key added to pool.");
            await load();
        } catch {
            setMsg("Failed to add key.");
        }
        setAdding(false);
    };

    const handleDeactivate = async (keyId) => {
        setMsg("");
        try {
            await deactivateAdminKey(keyId);
            setMsg("Key deactivated.");
            await load();
        } catch {
            setMsg("Failed to deactivate key.");
        }
    };

    return (
        <GlassCard className="flex flex-col gap-5 w-full backdrop-blur-[50px]">
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">Admin</span>
                <h2 className="text-lg font-primary text-text-primary">System Key Pool</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
                Keys in this pool are shared across all users who have not configured BYOK.
                The runtime rotates through them automatically and falls back to the next key on failure.
            </p>

            {/* Existing keys */}
            <div className="flex flex-col gap-2">
                {keys.length === 0 && (
                    <p className="text-sm text-text-secondary/50 italic">No system keys configured yet.</p>
                )}
                {keys.map((k) => (
                    <div
                        key={k.id}
                        className="flex items-center justify-between bg-black/30 border border-white/10 rounded-md px-4 py-2.5"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{k.provider}</span>
                            <span className="font-mono text-sm text-text-primary">{k.key_preview}</span>
                            <span className="text-[10px] text-text-secondary/40">
                                Added {new Date(k.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <button
                            onClick={() => handleDeactivate(k.id)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 px-3 py-1.5 rounded-sm transition-colors"
                        >
                            Deactivate
                        </button>
                    </div>
                ))}
            </div>

            {/* Add new key */}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Add Key to Pool</p>
                <div className="flex gap-3">
                    <select
                        value={newProvider}
                        onChange={(e) => setNewProvider(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-md px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-brand-primary/50 transition-colors"
                    >
                        {Object.entries(PROVIDER_CONFIGS).map(([k, cfg]) => (
                            <option key={k} value={k}>{cfg.label}</option>
                        ))}
                    </select>
                    <input
                        type="password"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="API key…"
                        className="flex-1 bg-black/40 border border-white/10 rounded-md px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={adding || !newKey.trim()}
                        className="bg-brand-primary text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-brand-primary/80 disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                        {adding ? "Adding…" : "Add Key"}
                    </button>
                </div>
            </div>

            {msg && <p className="text-sm text-text-secondary">{msg}</p>}
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Settings Page                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function Settings() {
    const [activeProvider, setActiveProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [byokActive, setByokActive] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [testResult, setTestResult] = useState(null);
    const [refreshUsage, setRefreshUsage] = useState(0);
    const byokRef = useRef(null);

    const providerCfg = PROVIDER_CONFIGS[activeProvider] || PROVIDER_CONFIGS.openai;

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAISettings();
                const s = res.settings;
                if (s.provider && PROVIDER_CONFIGS[s.provider]) {
                    setActiveProvider(s.provider);
                }
                setByokActive(Boolean(s.byok_active));
                setIsAdmin(Boolean(s.is_admin));
            } catch (err) {
                // 401 = not authenticated (guest mode or expired token) — not a real error
                const status = err?.response?.status;
                if (status === 401 || status === 403) {
                    // silently default — user is in guest mode
                } else {
                    setError("Could not load AI settings. Is the backend running?");
                }
            }
        };
        load();
    }, []);


    useEffect(() => {
        setApiKey("");
        setTestResult(null);
        setError("");
        setSuccessMessage("");
    }, [activeProvider]);

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        setSuccessMessage("");
        setTestResult(null);

        const cfg = PROVIDER_CONFIGS[activeProvider];
        if (cfg.needsKey && !apiKey.trim()) {
            setError(`${cfg.keyLabel} is required for ${cfg.label}.`);
            setIsSaving(false);
            return;
        }

        try {
            const response = await saveAISettings({
                provider: activeProvider,
                base_url: customUrl || cfg.baseUrl,
                api_key: apiKey.trim(),
                retain_existing_key: !apiKey.trim(),
            });
            setByokActive(Boolean(response.settings?.byok_active));
            setSuccessMessage("Your API key is saved. AI usage is now billed to your account.");
            setRefreshUsage((n) => n + 1);
        } catch {
            setError("Failed to save your API key.");
        }
        setIsSaving(false);
    };

    const handleRemoveBYOK = async () => {
        setIsRemoving(true);
        setError("");
        setSuccessMessage("");
        try {
            await deleteBYOKKey();
            setByokActive(false);
            setApiKey("");
            setSuccessMessage("BYOK key removed. You are back on the free managed plan.");
            setRefreshUsage((n) => n + 1);
        } catch {
            setError("Failed to remove your API key.");
        }
        setIsRemoving(false);
    };

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        setError("");
        try {
            const res = await testAIConnection();
            setTestResult(res);
        } catch (err) {
            setTestResult({
                status: "error",
                message: err.response?.data?.detail || "Backend unreachable.",
                ai_ready: false,
            });
        }
        setIsTesting(false);
    };

    const scrollToBYOK = () => {
        byokRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <main className="w-full relative min-h-[80vh] flex flex-col items-center py-12 px-4 sm:px-8">
            <DNABackground />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-[1]">
                <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] blur-[80px] animate-spin-slow opacity-20 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="w-full max-w-3xl relative z-[2] flex flex-col gap-8">
                {/* Header */}
                <div className="text-center mb-2 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-primary tracking-tight pb-2 leading-tight text-white">
                        AI{" "}
                        <span className="font-primary italic font-light bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent">
                            Settings
                        </span>
                    </h1>
                    <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed mt-2 font-primary">
                        Track your daily usage and configure your own API key for unlimited access.
                    </p>
                </div>

                {/* ── Usage Card ─────────────────────────────────────────── */}
                <GlassCard className="flex flex-col gap-5 w-full backdrop-blur-[50px]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-text-primary uppercase tracking-wider text-sm">
                            Today's Usage
                        </h2>
                        {byokActive && (
                            <span className="text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-2.5 py-1 rounded-full font-medium">
                                BYOK Active
                            </span>
                        )}
                    </div>

                    <UsageMeter
                        byokActive={byokActive}
                        onSetupBYOK={scrollToBYOK}
                        refreshKey={refreshUsage}
                    />
                </GlassCard>

                {/* ── BYOK Section ───────────────────────────────────────── */}
                <div ref={byokRef}>
                    <GlassCard className="flex flex-col gap-6 w-full backdrop-blur-[50px]">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-base font-semibold text-text-primary uppercase tracking-wider text-sm">
                                Bring Your Own Key (BYOK)
                            </h2>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Add your own provider API key for{" "}
                                <span className="text-text-primary font-medium">unlimited AI usage</span>. Your key is
                                stored securely on the server — it is never exposed to the browser.
                            </p>
                        </div>

                        {/* Provider Selector */}
                        <div className="flex flex-col gap-3">
                            <label className="text-xs font-medium text-brand-primary uppercase tracking-wider">
                                AI Provider
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {Object.entries(PROVIDER_CONFIGS).map(([key, cfg]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveProvider(key)}
                                        className={`px-4 py-3 rounded-md border text-sm font-medium transition-all text-left ${
                                            activeProvider === key
                                                ? "border-brand-primary/70 bg-brand-primary/10 text-text-primary"
                                                : "border-white/10 bg-black/40 text-text-secondary hover:border-white/30"
                                        }`}
                                    >
                                        {cfg.label}
                                        {activeProvider === key && (
                                            <span className="block text-[10px] text-brand-primary mt-0.5">Selected</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/10" />

                        {/* Key field */}
                        {providerCfg.needsKey && (
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-text-primary uppercase tracking-wider">
                                        {providerCfg.keyLabel}
                                    </label>
                                    {byokActive && !apiKey && (
                                        <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                                            • Key on file
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder={byokActive ? "Enter new key to replace existing…" : providerCfg.keyPlaceholder}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                                />
                            </div>
                        )}

                        {/* URL field */}
                        {providerCfg.needsUrl && (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-primary uppercase tracking-wider">
                                    {providerCfg.urlLabel || "Inference URL"}
                                </label>
                                <input
                                    type="text"
                                    value={customUrl || providerCfg.baseUrl}
                                    onChange={(e) => setCustomUrl(e.target.value)}
                                    placeholder={providerCfg.urlPlaceholder}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                                />
                            </div>
                        )}

                        {/* Provider-specific hints */}
                        {activeProvider === "gemini" && (
                            <div className="rounded-md bg-blue-900/20 border border-blue-500/20 px-4 py-3 text-sm text-blue-300 leading-relaxed">
                                Get a free API key at{" "}
                                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                                    aistudio.google.com/apikey
                                </a>
                                . Uses the OpenAI-compatible endpoint — no extra setup needed.
                            </div>
                        )}
                        {activeProvider === "lightning" && (
                            <div className="rounded-md bg-purple-900/20 border border-purple-500/20 px-4 py-3 text-sm text-purple-300 leading-relaxed">
                                Deploy your model on Lightning AI Studio, copy the inference endpoint URL, and paste it above.
                            </div>
                        )}

                        {/* Test result */}
                        {testResult && (
                            <div className={`rounded-md px-4 py-3 text-sm leading-relaxed border ${
                                testResult.ai_ready
                                    ? "bg-green-900/20 border-green-500/30 text-green-300"
                                    : "bg-red-900/20 border-red-500/30 text-red-300"
                            }`}>
                                {testResult.ai_ready ? "✓ " : "✗ "}
                                {testResult.message}
                                {testResult.sample_response && (
                                    <span className="block mt-1 text-text-secondary text-xs">
                                        Preview: "{testResult.sample_response}"
                                    </span>
                                )}
                            </div>
                        )}

                        {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
                        {successMessage && <div className="text-green-400 text-sm font-medium">{successMessage}</div>}

                        {/* Actions */}
                        <div className="pt-2 flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleTest}
                                    disabled={isTesting || isSaving}
                                    className="border border-white/20 text-text-secondary text-sm px-5 py-2.5 rounded-sm hover:border-white/40 hover:text-text-primary transition-colors disabled:opacity-40"
                                >
                                    {isTesting ? "Testing…" : "Test Connection"}
                                </button>
                                {byokActive && (
                                    <button
                                        onClick={handleRemoveBYOK}
                                        disabled={isRemoving}
                                        className="border border-red-500/30 text-red-400 text-sm px-5 py-2.5 rounded-sm hover:border-red-500/60 hover:text-red-300 transition-colors disabled:opacity-40"
                                    >
                                        {isRemoving ? "Removing…" : "Remove Key"}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || isTesting}
                                className="bg-brand-primary text-text-primary font-medium text-sm px-8 py-2.5 rounded-sm hover:bg-brand-primary/80 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? "Saving…" : "Save Key"}
                            </button>
                        </div>
                    </GlassCard>
                </div>

                {/* ── Admin Key Pool (admin only) ─────────────────────────── */}
                {isAdmin && <AdminKeyPool />}
            </div>
        </main>
    );
}
