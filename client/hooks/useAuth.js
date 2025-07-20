import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/auth/me`, {
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch user');

            setUser(typeof data.user === 'string' ? { id: data.user } : data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            await fetchUser();
            return { success: true, user: data.user };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            await fetchUser();
            return { success: true, user: data.user };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            setUser(null);
        }
    };

    // ✅ Memoize authFetch so it's stable across renders
    const authFetch = useCallback(async (url, options = {}) => {
        const res = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    }, []);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        authFetch,
    };
}
