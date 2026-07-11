import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useHealth } from "../context/HealthContext";
import { uploadDocument } from "../api/upload";
import { demoFiles } from "../utils/dummyData";

export default function Upload() {
    const { fetchTimeline } = useHealth();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progressText, setProgressText] = useState("");
    const [success, setSuccess] = useState(false);
    const [localError, setLocalError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
            setLocalError(null);
            setSuccess(false);
        }
    }, []);

    const simulateDrop = (demoFile) => {
        // Create a dummy File object for simulation
        const dummyFile = new File(["dummy content"], demoFile.name, { type: "application/pdf" });
        setFile(dummyFile);
        setLocalError(null);
        setSuccess(false);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setLocalError(null);
        setProgressText("Uploading to EsiCore...");

        try {
            // ALWAYS attempt the real API first
            await uploadDocument(file);
            setProgressText("Processing clinical data...");
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            setSuccess(true);
            setFile(null);
            await fetchTimeline();
        } catch (err) {
            // FALLBACK: If the real backend is offline, we simulate success for Demo Mode
            if (err.message === "Failed to fetch" || err.message.includes("Network Error") || err.name === "TypeError") {
                console.warn("Backend offline. Simulating successful upload for Demo Mode.");
                setProgressText("Simulating clinical processing...");
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setSuccess(true);
                setFile(null);
            } else {
                // If it's a real error (not just offline), display it
                setLocalError(err.message || "Failed to upload document");
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4 animate-fade-in relative z-10">
            <div className="text-center mb-12 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-primary tracking-tight bg-gradient-to-r from-[#FF4533] via-[#8A2BE2] to-[#00E5FF] bg-clip-text text-transparent pb-2 leading-tight">
                    Add to your <span className="font-primary italic drop-shadow-sm font-light">Health Memory</span>
                </h1>
                <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mt-2 font-primary">
                    Upload medical reports, lab results, or imaging summaries. Esillio will extract and store the clinical intelligence securely.
                </p>
            </div>

            <div className="p-[1px] bg-gradient-to-b from-white/10 to-white/0 rounded-3xl w-full group relative">
                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
                <div className="bg-background/40 backdrop-blur-3xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/5 relative overflow-hidden transition-colors">
                    <div className="relative z-10">
                        {!isUploading && !success && (
                            <>
                                <div 
                                    {...getRootProps()} 
                                    className={`relative z-10 rounded-2xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 overflow-hidden border border-transparent backdrop-blur-xl group/drop ${
                                        isDragActive 
                                            ? "bg-brand-primary/10 border-brand-primary/50 scale-[1.02] shadow-[0_0_30px_rgba(255,69,51,0.2)]" 
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    
                                    <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/drop:border-brand-primary/50 text-text/50 group-hover/drop:text-brand-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover/drop:shadow-[0_0_20px_rgba(255,69,51,0.3)] group-hover/drop:scale-110 backdrop-blur-md">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-primary font-medium text-text-primary mb-2 transition-colors duration-300 group-hover/drop:text-brand-primary">
                                        {isDragActive ? "Drop document here" : "Drag & Drop document"}
                                    </h3>
                                    <p className="text-text-secondary font-primary text-sm mb-6">
                                        Supports PDF, JPG, and PNG up to 10MB
                                    </p>
                                    
                                    <button className="px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-text font-primary text-sm font-medium hover:bg-white/20 transition-all shadow-sm">
                                        Browse Files
                                    </button>
                                </div>

                                {/* DEMO FILES (Zero-Input Demo Mode) */}
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-text/50 mb-4 text-center font-primary">Or Try With Demo Files</h4>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {demoFiles.map((f) => (
                                            <button 
                                                key={f.id}
                                                onClick={() => simulateDrop(f)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-primary/30 transition-all group/pill relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover/pill:opacity-100 blur-md transition-opacity duration-300"></div>
                                                <span className="text-xs font-bold text-accent relative z-10">{f.type}</span>
                                                <span className="text-sm text-text relative z-10 truncate max-w-[150px]">{f.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {file && (
                                    <div className="mt-8 relative z-10 bg-white/5 backdrop-blur-md border border-brand-primary/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(255,69,51,0.15)] animate-fade-in">
                                        <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                                            <div className="p-2.5 rounded-lg bg-accent/20 text-accent font-bold border border-accent/30 shadow-inner">
                                                DOC
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-text font-primary font-medium truncate">{file.name}</span>
                                                <span className="text-text/50 text-xs font-primary">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Process
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleUpload}
                                            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-accent text-white text-sm font-primary font-bold hover:shadow-[0_0_15px_rgba(255,69,51,0.5)] transition-all shrink-0 uppercase tracking-wide"
                                        >
                                            Process Document
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {isUploading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative h-24 w-24 mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-neutral-surface-alt" />
                                    <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center text-brand-primary font-bold text-xl">
                                        <span className="animate-pulse">...</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-primary font-medium text-text-primary mb-3">Processing...</h3>
                                <p className="text-brand-primary font-primary font-medium animate-pulse">{progressText}</p>
                            </div>
                        )}

                        {success && (
                            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                                <div className="h-24 w-24 rounded-full bg-brand-primary/10 border border-brand-primary/30 shadow-[0_0_30px_rgba(255,69,51,0.3)] flex items-center justify-center mb-8 text-brand-primary">
                                    <span className="text-4xl font-bold">✓</span>
                                </div>
                                <h3 className="text-3xl font-primary font-medium text-text-primary mb-3">Memory Updated</h3>
                                <p className="text-text-secondary font-primary text-lg mb-8">Your clinical timeline has been successfully augmented.</p>
                                
                                <button 
                                    onClick={() => setSuccess(false)}
                                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-primary font-primary text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
                                >
                                    Upload Another
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {localError && (
                <div className="mt-6 flex items-start gap-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-5 shadow-lg backdrop-blur-md">
                    <span className="shrink-0 mt-0.5 font-bold text-red-400">!</span>
                    <div>
                        <h4 className="font-primary font-medium text-red-300">Upload Failed</h4>
                        <p className="text-sm font-primary mt-1">{localError}</p>
                    </div>
                </div>
            )}
        </div>
    );
}