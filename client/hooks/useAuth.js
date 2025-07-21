import { useState, useEffect, useCallback } from 'react';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword, 
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

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
    
    // Monitor Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in to Firebase, check backend sync
                await fetchUser();
            } else {
                // User is signed out from Firebase
                setUser(null);
                setLoading(false);
            }
        });
        
        return unsubscribe;
    }, []);

    const login = async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Sign in with Firebase
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
            if (!res.ok) throw new Error(data.message || 'Backend login failed');

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
            const { email, password, firstName, lastName, role, organization } = formData;
            
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 2. Update Firebase user profile
            await updateProfile(userCredential.user, {
                displayName: `${firstName} ${lastName}`
            });
            
            // 3. Get Firebase ID token
            const idToken = await userCredential.user.getIdToken();
            
            // 4. Send token and user data to Flask backend
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    idToken,
                    role: role || 'client',
                    firstName,
                    lastName,
                    organization: organization || null
                }),
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
            // 1. Logout from Flask backend
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            
            // 2. Sign out from Firebase
            await firebaseSignOut(auth);
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
