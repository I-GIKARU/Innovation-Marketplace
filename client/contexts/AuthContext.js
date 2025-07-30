'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import apiClient from '@/lib/apiClient';

const AuthContext = createContext({});

// Global singleton flag to prevent multiple auth instances
let isAuthFetching = false;
let authInstance = null;

const AuthProviderComponent = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = useCallback(async () => {
        // Prevent multiple fetches using global flag
        if (isAuthFetching) return;

        isAuthFetching = true;
        setLoading(true);
        try {
            const response = await apiClient.get('/auth/me', {
                withCredentials: true,
            });
            
            setUser(response.data.user || null);
        } catch (error) {
            console.log('Auth check failed:', error.message);
            setUser(null);
        } finally {
            setLoading(false);
            isAuthFetching = false;
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in to Firebase, now check our backend
                if (!isAuthFetching) {
                    await fetchUser();
                }
            } else {
                // User is signed out
                setUser(null);
                setLoading(false);
                isAuthFetching = false;
            }
        });

        return () => unsubscribe();
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
            const response = await apiClient.post('/auth/login', 
                { idToken },
                { withCredentials: true }
            );

            const data = response.data;

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
            const response = await apiClient.post('/auth/login',
                { idToken },
                { withCredentials: true }
            );

            const data = response.data;

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
            await apiClient.post('/auth/logout', {}, {
                withCredentials: true,
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
        try {
            const axiosConfig = {
                url: url.startsWith('http') ? url : url,
                method: options.method || 'GET',
                withCredentials: true,
                ...options
            };

            // Handle different data types
            if (options.body) {
                if (options.body instanceof FormData) {
                    axiosConfig.data = options.body;
                } else if (typeof options.body === 'string') {
                    axiosConfig.data = JSON.parse(options.body);
                } else {
                    axiosConfig.data = options.body;
                }
            }

            const response = await apiClient(axiosConfig);
            return response.data;
        } catch (error) {
            // Handle token expiration
            if (error.response?.status === 401) {
                console.log('Token expired, logging out...');
                await logout();
                throw new Error('Session expired. Please log in again.');
            }
            // Return more detailed error information
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error(error.response?.data?.message || error.message || 'Request failed');
        }
    }, []);

    // Get token from localStorage
    const getToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }, []);

    // Create memoized auth value object to prevent unnecessary re-renders
    const authValue = useMemo(() => ({
        user,
        loading,
        error,
        isAuthenticated: !!user,
        token: getToken(),
        googleSignIn,
        adminLogin,
        logout,
        authFetch,
        getToken,
    }), [user, loading, error, getToken, googleSignIn, adminLogin, logout, authFetch]);
    
    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

// Export the provider component as AuthProvider for convenience
export const AuthProvider = AuthProviderComponent;

export default AuthContext;
