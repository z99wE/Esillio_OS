import React, { useState, useEffect } from "react";
import GlassCard from "../components/GlassCard";
import DNABackground from "../components/DNABackground";
import client from "../api/client";

export default function Settings() {
    const [keys, setKeys] = useState({
        openai: "",
        anthropic: "",
        gemini: "",
        localUrl: ""
    });
    
    const [activeProvider, setActiveProvider] = useState("openai");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Load from local storage AND backend on mount
    useEffect(() => {
        const loadSettings = async () => {
            // 1. Load keys from localStorage
            const openaiKey = localStorage.getItem("esillio_openai_key") || "";
            const anthropicKey = localStorage.getItem("esillio_anthropic_key") || "";
            const geminiKey = localStorage.getItem("esillio_gemini_key") || "";
            let localUrl = localStorage.getItem("esillio_local_url") || "";

            // 2. Fetch active backend settings
            try {
                const response = await client.get("/settings/ai");
                const backendSettings = response.data.settings;

                if (backendSettings.provider === "local") {
                    setActiveProvider("gemma");
                } else if (backendSettings.provider === "openai") {
                    if (backendSettings.base_url === "https://api.openai.com/v1") {
                        setActiveProvider("openai");
                        if (backendSettings.api_key && backendSettings.api_key !== "dummy_key_to_bypass_init") {
                            // If backend has a real key and we don't have one in localstorage, use it
                            if (!openaiKey) {
                                localStorage.setItem("esillio_openai_key", backendSettings.api_key);
                            }
                        }
                    } else {
                        setActiveProvider("custom");
                        localUrl = backendSettings.base_url;
                        localStorage.setItem("esillio_local_url", localUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch backend settings", err);
            }

            setKeys({
                openai: localStorage.getItem("esillio_openai_key") || "",
                anthropic: anthropicKey,
                gemini: geminiKey,
                localUrl: localUrl
            });
        };

        loadSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        setSuccessMessage("");

        // 1. Save to localStorage
        localStorage.setItem("esillio_openai_key", keys.openai);
        localStorage.setItem("esillio_anthropic_key", keys.anthropic);
        localStorage.setItem("esillio_gemini_key", keys.gemini);
        localStorage.setItem("esillio_local_url", keys.localUrl);

        // 2. Prepare payload for backend
        let payload = {
            provider: "openai",
            base_url: "https://api.openai.com/v1",
            api_key: keys.openai || "dummy_key_to_bypass_init",
            model: "gpt-4o"
        };

        if (activeProvider === "gemma") {
            payload = {
                provider: "local",
                base_url: "http://localhost:11434/v1", // unused by local provider
                api_key: "dummy_key",
                model: "gemma"
            };
        } else if (activeProvider === "custom") {
            payload = {
                provider: "openai",
                base_url: keys.localUrl || "http://localhost:11434/v1",
                api_key: "dummy_key_to_bypass_init",
                model: "local-model"
            };
        } else {
            // openai
            if (!keys.openai) {
                setError("OpenAI API Key is required when OpenAI is selected.");
                setIsSaving(false);
                return;
            }
        }

        // 3. Post to backend
        try {
            await client.post("/settings/ai", payload);
            setSuccessMessage("Settings saved successfully to browser and backend.");
        } catch (err) {
            console.error(err);
            setError("Failed to save settings to backend.");
        }

        setIsSaving(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKeys(prev => ({ ...prev, [name]: value }));
    };

    return (
        <main className="w-full relative min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-8">
            <DNABackground />
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-[1]">
                <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,#ff4533,#8a2be2,#0055ff,#00ff88,#0055ff,#8a2be2,#ff4533)] blur-[80px] animate-spin-slow opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="w-full max-w-3xl relative z-[2] flex flex-col gap-8">
                <div className="text-center flex flex-col items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                        AI Configuration
                    </h1>
                    <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
                        Select your active AI provider. Keys are stored in your browser, and the configuration is synced with the Esillio backend.
                    </p>
                </div>

                <GlassCard className="flex flex-col gap-8 w-full backdrop-blur-[50px]">
                    
                    {/* Active Provider Selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-brand-primary uppercase tracking-wider">Active Provider</label>
                        <div className="flex gap-4 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-4 py-2 rounded-md border border-white/10 hover:border-brand-primary/50 transition-colors">
                                <input type="radio" name="provider" value="openai" checked={activeProvider === "openai"} onChange={() => setActiveProvider("openai")} className="accent-brand-primary" />
                                <span className="text-text-primary">OpenAI</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-4 py-2 rounded-md border border-white/10 hover:border-brand-primary/50 transition-colors">
                                <input type="radio" name="provider" value="custom" checked={activeProvider === "custom"} onChange={() => setActiveProvider("custom")} className="accent-brand-primary" />
                                <span className="text-text-primary">Local URL (OpenAI Compatible)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-black/40 px-4 py-2 rounded-md border border-white/10 hover:border-brand-primary/50 transition-colors">
                                <input type="radio" name="provider" value="gemma" checked={activeProvider === "gemma"} onChange={() => setActiveProvider("gemma")} className="accent-brand-primary" />
                                <span className="text-text-primary">Built-in Local (Gemma)</span>
                            </label>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-white/10 my-2"></div>

                    {/* OpenAI */}
                    <div className={`flex flex-col gap-2 transition-opacity ${activeProvider !== 'openai' ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-primary uppercase tracking-wider">OpenAI API Key</label>
                            {!!keys.openai && <span className="flex items-center gap-1 text-xs text-green-400 font-bold">• Present</span>}
                        </div>
                        <input 
                            type="password" 
                            name="openai"
                            value={keys.openai}
                            onChange={handleChange}
                            placeholder="sk-..." 
                            className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                    </div>

                    {/* Local LLM */}
                    <div className={`flex flex-col gap-2 transition-opacity ${activeProvider !== 'custom' ? 'opacity-50' : 'opacity-100'}`}>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-primary uppercase tracking-wider">Local Inference URL (e.g. Ollama)</label>
                            {!!keys.localUrl && <span className="flex items-center gap-1 text-xs text-green-400 font-bold">• Present</span>}
                        </div>
                        <input 
                            type="text" 
                            name="localUrl"
                            value={keys.localUrl}
                            onChange={handleChange}
                            placeholder="http://localhost:11434/v1" 
                            className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                    </div>

                    {/* Anthropic */}
                    <div className="flex flex-col gap-2 opacity-50">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-primary uppercase tracking-wider">Anthropic API Key <span className="text-[10px] text-brand-primary ml-2">(Not yet supported by backend)</span></label>
                            {!!keys.anthropic && <span className="flex items-center gap-1 text-xs text-green-400 font-bold">• Present</span>}
                        </div>
                        <input 
                            type="password" 
                            name="anthropic"
                            value={keys.anthropic}
                            onChange={handleChange}
                            placeholder="sk-ant-..." 
                            className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                    </div>

                    {/* Gemini */}
                    <div className="flex flex-col gap-2 opacity-50">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-primary uppercase tracking-wider">Google Gemini API Key <span className="text-[10px] text-brand-primary ml-2">(Not yet supported by backend)</span></label>
                            {!!keys.gemini && <span className="flex items-center gap-1 text-xs text-green-400 font-bold">• Present</span>}
                        </div>
                        <input 
                            type="password" 
                            name="gemini"
                            value={keys.gemini}
                            onChange={handleChange}
                            placeholder="AIza..." 
                            className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-brand-primary/50 transition-colors"
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
                    {successMessage && <div className="text-green-400 text-sm font-medium">{successMessage}</div>}

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-brand-primary text-text-primary font-medium text-sm px-8 py-3 rounded-sm hover:bg-brand-primary/80 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    Save Configuration
                                </>
                            )}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </main>
    );
}
