import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async (userId) => {
            if (userId === '00000000-0000-4000-a000-000000000000') return 'patient';
            try {
                const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
                if (data && data.role) return data.role;
            } catch (e) {
                console.error("Failed to fetch role", e);
            }
            return 'patient';
        };

        const handleSession = async (supabaseSession) => {
            if (supabaseSession?.user) {
                const role = await fetchRole(supabaseSession.user.id);
                const sessionUser = {
                    id: supabaseSession.user.id,
                    email: supabaseSession.user.email,
                    patient_id: supabaseSession.user.id,
                    role: role
                };
                setUser(sessionUser);
                setSession(supabaseSession);
                localStorage.setItem('esillio_token', supabaseSession.access_token);
            } else {
                setUser(null);
                setSession(null);
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
        session,
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
