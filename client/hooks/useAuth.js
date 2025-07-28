import { useState, useEffect, useCallback } from 'react';
import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async (preserveUser = false) => {
        try {
            // Only set loading if we don't want to preserve the current user state
            if (!preserveUser) {
                setLoading(true);
            }
            
            // Add timeout to prevent getting stuck
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const res = await fetch(`${API_BASE}/auth/me`, {
                credentials: 'include',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch user');

            setUser(typeof data.user === 'string' ? { id: data.user } : data.user);
        } catch (error) {
            console.log('Auth check failed:', error.message);
            // Only clear user if this is not a background refresh
            if (!preserveUser) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    
    // Monitor Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in to Firebase, check backend sync
                // If we already have a user, do a background refresh to avoid flickering
                const shouldPreserveUser = !!user;
                if (!shouldPreserveUser) {
                    setLoading(true);
                }
                await fetchUser(shouldPreserveUser);
            } else {
                // User is signed out from Firebase
                setUser(null);
                setLoading(false);
            }
        });
        
        return unsubscribe;
    }, [fetchUser]);
    

    const googleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Sign in with Google
            const provider = new GoogleAuthProvider();
            // Force account selection and ensure fresh login
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            const result = await signInWithPopup(auth, provider);
            
            // 2. Get Firebase ID token
            const idToken = await result.user.getIdToken();
            
            // 3. Send token to Flask backend for automatic account creation
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Google sign-in failed');

            // Store JWT token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            await fetchUser();
            return { success: true, user: data.user };
        } catch (err) {
            // Handle user cancellation gracefully
            if (err.code === 'auth/popup-cancelled-by-user' || err.code === 'auth/cancelled-popup-request') {
                setError(null); // Don't show error for user cancellation
                return { success: false, cancelled: true };
            }
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const adminLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Sign in with Firebase using email/password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // 2. Get Firebase ID token
            const idToken = await userCredential.user.getIdToken();
            
            // 3. Send token to Flask backend
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Admin login failed');

            // Store JWT token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

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
            // 1. Logout from Flask backend
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            // 2. Sign out from Firebase
            await firebaseSignOut(auth);
            
            // 3. Clear localStorage token
            localStorage.removeItem('token');
        } finally {
            setUser(null);
        }
    };

    const authFetch = useCallback(async (url, options = {}) => {
        const isFormData = options.body instanceof FormData;
        const headers = { ...(options.headers || {}) };

        if (!isFormData && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        // Add bearer token from local storage if available
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(url.startsWith('http') ? url : `${API_BASE}${url}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        // Handle token expiration
        if (res.status === 401) {
            console.log('Token expired, logging out...');
            await logout();
            throw new Error('Session expired. Please log in again.');
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        return data;
    }, []);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        googleSignIn,
        adminLogin,
        logout,
        authFetch,
    };
}
