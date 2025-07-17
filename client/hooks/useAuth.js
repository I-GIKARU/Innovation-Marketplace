import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user from backend (uses HttpOnly cookie)
    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/me`, {
                credentials: 'include', // 👈 send cookies
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
            setUser(data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async ({ email, password, role }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // 👈 save JWT in cookie
                body: JSON.stringify({ email, password, role }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            await fetchUser(); // Refresh user state
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
            const res = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Registration failed');
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
            await fetch(`${API_BASE}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            setUser(null);
        }
    };

    const authFetch = async (url, options = {}) => {
        const res = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
        return data;
    };

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
