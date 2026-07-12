import React, { useState, useEffect, useCallback } from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";
import client from "../api/client";

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
    local: {
        label: "Built-in Local Model (Gemma)",
        baseUrl: "",
        model: "gemma",
        keyPlaceholder: "",
        keyLabel: "",
        needsKey: false,
        needsUrl: false,
    },
};

export default function Settings() {
    const [activeProvider, setActiveProvider] = useState("openai");
    const [apiKey, setApiKey] = useState("");
    const [customUrl, setCustomUrl] = useState("");
    const [customModel, setCustomModel] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [testResult, setTestResult] = useState(null); // { status, message }

    const providerCfg = PROVIDER_CONFIGS[activeProvider] || PROVIDER_CONFIGS.openai;

    // Load saved settings on mount
    useEffect(() => {
        const load = async () => {
            // Restore last active provider from localStorage
            const saved = localStorage.getItem("esillio_active_provider");
            if (saved && PROVIDER_CONFIGS[saved]) setActiveProvider(saved);

            // Load key from localStorage
            const storedKey = localStorage.getItem(`esillio_key_${saved || "openai"}`) || "";
            setApiKey(storedKey);

            // Fetch from backend
            try {
                const res = await client.get("/settings/ai");
                const s = res.data.settings;
                if (s.provider && PROVIDER_CONFIGS[s.provider]) {
                    setActiveProvider(s.provider);
                    setCustomUrl(s.base_url || "");
                    setCustomModel(s.model || "");
                }
            } catch {
                // Backend offline — use localStorage only
            }
        };
        load();
    }, []);

    // When provider changes, load the stored key for that provider
    useEffect(() => {
        const storedKey = localStorage.getItem(`esillio_key_${activeProvider}`) || "";
        setApiKey(storedKey);
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

        // Persist key per-provider in localStorage
        localStorage.setItem(`esillio_key_${activeProvider}`, apiKey.trim());
        localStorage.setItem("esillio_active_provider", activeProvider);

        // Also set the legacy key used by the axios interceptor
        if (activeProvider === "openai") {
            localStorage.setItem("esillio_openai_key", apiKey.trim());
        } else if (activeProvider === "gemini") {
            localStorage.setItem("esillio_gemini_key", apiKey.trim());
        } else if (activeProvider === "custom" || activeProvider === "lightning") {
            localStorage.setItem("esillio_local_url", customUrl);
        }

        const payload = {
            provider: activeProvider,
            base_url: customUrl || cfg.baseUrl,
            api_key: apiKey.trim() || "dummy_key_to_bypass_init",
            model: customModel || cfg.model,
        };

        try {
            await client.post("/settings/ai", payload);
            setSuccessMessage("Settings saved. AI runtime reloaded.");
        } catch {
            setError("Failed to save to backend. Frontend keys are still saved.");
        }

        setIsSaving(false);
    };

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        setError("");

        try {
            const res = await client.post("/settings/ai/test");
            setTestResult(res.data);
        } catch (err) {
            setTestResult({
                status: "error",
                message: err.response?.data?.detail || "Backend unreachable.",
                ai_ready: false,
            });
        }

        setIsTesting(false);
    };

    return (
        <main className="w-full relative min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-8">
            <DNABackground />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-[1]">
                <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] blur-[80px] animate-spin-slow opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="w-full max-w-3xl relative z-[2] flex flex-col gap-8">
                <div className="text-center flex flex-col items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                        AI Configuration
                    </h1>
                    <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Choose your AI provider. Keys are stored in your browser and synced to the Esillio backend.
                    </p>
                </div>

                <GlassCard className="flex flex-col gap-8 w-full backdrop-blur-[50px]">

                    {/* Provider Selector */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-brand-primary uppercase tracking-wider">
                            Active Provider
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                        <span className="block text-[10px] text-brand-primary mt-0.5">Active</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    {/* API Key Field */}
                    {providerCfg.needsKey && (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-text-primary uppercase tracking-wider">
                                    {providerCfg.keyLabel}
                                </label>
                                {apiKey && (
                                    <span className="flex items-center gap-1 text-xs text-green-400 font-medium">
                                        • Present
                                    </span>
                                )}
                            </div>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                                placeholder={providerCfg.keyPlaceholder}
                                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                            />
                        </div>
                    )}

                    {/* URL Field (for custom / lightning) */}
                    {providerCfg.needsUrl && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary uppercase tracking-wider">
                                {providerCfg.urlLabel || "Inference URL"}
                            </label>
                            <input
                                type="text"
                                value={customUrl || providerCfg.baseUrl}
                                onChange={e => setCustomUrl(e.target.value)}
                                placeholder={providerCfg.urlPlaceholder}
                                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                            />
                        </div>
                    )}

                    {/* Model Override */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary uppercase tracking-wider text-xs">
                            Model (optional override)
                        </label>
                        <input
                            type="text"
                            value={customModel || providerCfg.model}
                            onChange={e => setCustomModel(e.target.value)}
                            placeholder={providerCfg.model}
                            className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-white/30 transition-colors text-sm"
                        />
                    </div>

                    {/* Google AI Studio hint */}
                    {activeProvider === "gemini" && (
                        <div className="rounded-md bg-blue-900/20 border border-blue-500/20 px-4 py-3 text-sm text-blue-300 leading-relaxed">
                            Get a free API key at{" "}
                            <a
                                href="https://aistudio.google.com/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-400"
                            >
                                aistudio.google.com/apikey
                            </a>
                            . This uses the OpenAI-compatible endpoint — no extra setup needed.
                        </div>
                    )}

                    {/* Lightning AI hint */}
                    {activeProvider === "lightning" && (
                        <div className="rounded-md bg-purple-900/20 border border-purple-500/20 px-4 py-3 text-sm text-purple-300 leading-relaxed">
                            Deploy your model on Lightning AI Studio, copy the inference endpoint URL, and paste it above.
                        </div>
                    )}

                    {/* Test Result */}
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
                                    Response preview: "{testResult.sample_response}"
                                </span>
                            )}
                        </div>
                    )}

                    {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
                    {successMessage && <div className="text-green-400 text-sm font-medium">{successMessage}</div>}

                    {/* Actions */}
                    <div className="pt-2 flex justify-between items-center gap-4">
                        <button
                            onClick={handleTest}
                            disabled={isTesting || isSaving}
                            className="flex items-center gap-2 border border-white/20 text-text-secondary text-sm px-6 py-3 rounded-sm hover:border-white/40 hover:text-text-primary transition-colors disabled:opacity-40"
                        >
                            {isTesting ? "Testing..." : "Test Connection"}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={isSaving || isTesting}
                            className="flex items-center gap-2 bg-brand-primary text-text-primary font-medium text-sm px-8 py-3 rounded-sm hover:bg-brand-primary/80 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}
