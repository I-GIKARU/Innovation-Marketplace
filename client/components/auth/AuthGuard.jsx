'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import CombinedAuth from './CombinedAuth';

const AuthGuard = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [showAuth, setShowAuth] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            setAuthChecked(true);
            
            if (!isAuthenticated) {
                setShowAuth(true);
                return;
            }

            // Check role if required
            if (requiredRole && user?.role !== requiredRole) {
                // Redirect to appropriate dashboard
                const correctDashboard = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/student';
                router.push(correctDashboard);
                return;
            }
        }
    }, [loading, isAuthenticated, user, requiredRole, router]);

    // Show loading state
    if (loading || !authChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show auth modal if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
                <AnimatePresence>
                    {showAuth && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        >
                            {/* Backdrop */}
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                            
                            {/* Auth Modal */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative z-10 w-full max-w-md mx-auto"
                            >
                                <CombinedAuth onClose={() => setShowAuth(false)} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Show unauthorized message if role doesn't match
    if (requiredRole && user?.role !== requiredRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Render children if authenticated and authorized
    return children;
};

export default AuthGuard;
