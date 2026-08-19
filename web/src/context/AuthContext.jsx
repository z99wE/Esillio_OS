import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

import { supabase } from '../supabaseClient';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async (userId) => {
            if (userId === '00000000-0000-4000-a000-000000000000') return 'patient';
            try {
                const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
                if (data && data.role) return data.role;
            } catch (e) {
                console.error("Failed to fetch role", e);
            }
            return 'patient';
        };

        const handleSession = async (session) => {
            if (session?.user) {
                const role = await fetchRole(session.user.id);
                const sessionUser = {
                    id: session.user.id,
                    email: session.user.email,
                    patient_id: session.user.id,
                    role: role
                };
                setUser(sessionUser);
                localStorage.setItem('esillio_token', session.access_token);
            } else {
                setUser(null);
                localStorage.removeItem('esillio_token');
            }
            setLoading(false);
        };

        // Fetch current session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('esillio_token');
    };

    const loginAsGuest = () => {
        const guestUser = { id: '00000000-0000-4000-a000-000000000000', email: 'guest@esillio.com', patient_id: '00000000-0000-4000-a000-000000000000' };
        localStorage.setItem('esillio_token', 'guest-token-123');
        setUser(guestUser);
    };

    const value = {
        user,
        loading,
        login,
        register,
        signOut,
        loginAsGuest,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
