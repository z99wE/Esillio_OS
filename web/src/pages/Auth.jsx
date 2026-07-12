import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
    const { user, login, register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

    if (user) {
        return <Navigate to="/health" replace />;
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isSignUp) {
                await register(email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto py-24 px-4 relative z-10 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-primary tracking-tight bg-gradient-to-r from-brand-primary via-accent-purple to-accent-blue bg-clip-text text-transparent pb-2 leading-tight">
                    Welcome to Esillio
                </h1>
                <p className="text-text-secondary mt-2">
                    {isSignUp ? "Create an account to securely store your health memory." : "Sign in to access your health memory."}
                </p>
            </div>

            <div className="bg-background/40 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
                <form onSubmit={handleAuth} className="flex flex-col gap-4 relative z-10">
                    <div>
                        <label className="text-sm font-semibold text-text-secondary mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-brand-primary/50 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-text-secondary mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-brand-primary/50 transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-accent-purple text-white font-bold tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-brand-primary text-sm font-medium hover:underline mt-2"
                    >
                        {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                    </button>
                </form>
            </div>
        </div>
    );
}
