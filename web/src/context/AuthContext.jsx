import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current session on mount from localStorage
        const token = localStorage.getItem('esillio_token');
        const storedUser = localStorage.getItem('esillio_user');
        
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('esillio_token', token);
        localStorage.setItem('esillio_user', JSON.stringify(user));
        setUser(user);
    };

    const register = async (email, password) => {
        const response = await apiClient.post('/api/auth/register', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('esillio_token', token);
        localStorage.setItem('esillio_user', JSON.stringify(user));
        setUser(user);
    };

    const signOut = () => {
        localStorage.removeItem('esillio_token');
        localStorage.removeItem('esillio_user');
        setUser(null);
    };

    const loginAsGuest = () => {
        const guestUser = { id: 'usr-demo-1', email: 'guest@esillio.com', patient_id: 'usr-demo-1' };
        localStorage.setItem('esillio_token', 'guest-token-123');
        localStorage.setItem('esillio_user', JSON.stringify(guestUser));
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
