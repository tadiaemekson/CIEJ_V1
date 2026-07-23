import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('ciej_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = await api.get('/auth/me');
            setUser(data.user || data);
        } catch (err) {
            console.error('Failed to validate token:', err);
            localStorage.removeItem('ciej_token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await api.post('/auth/login', { email, password });
            localStorage.setItem('ciej_token', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            localStorage.removeItem('ciej_token');
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await api.post('/auth/register', userData);
            localStorage.setItem('ciej_token', data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            localStorage.removeItem('ciej_token');
            setUser(null);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout API failed:', err);
        } finally {
            localStorage.removeItem('ciej_token');
            setUser(null);
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
