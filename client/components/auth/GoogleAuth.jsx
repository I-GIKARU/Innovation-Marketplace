"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { FcGoogle } from "react-icons/fc";
import { RiGraduationCapLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const GoogleAuth = ({ onClose }) => {
    const router = useRouter();
    const { googleSignIn, loading, error } = useAuth();

    const redirectToDashboard = (role) => {
        router.push(`/dashboard/${role}`);
    };

    const handleGoogleSignIn = async () => {
        const res = await googleSignIn();
        if (res.success) {
            redirectToDashboard(res.user.role);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
                {/* Minimal decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 to-orange-600/3 rounded-2xl"></div>
                
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                    >
                        <XMarkIcon className="w-5 h-5 text-white group-hover:text-orange-300 transition-colors duration-200" />
                    </button>
                )}
                
                <div className="relative z-10 p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <RiGraduationCapLine className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome to InnoMarket
                        </h2>
                        <p className="text-gray-300 text-sm mb-3">
                            Sign in with your Google account
                        </p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                            <p className="text-xs text-gray-300 mb-2 font-medium">You'll be assigned a role based on your email:</p>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-green-300">@student.moringaschool.com → Student Dashboard</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-blue-300">Any other email → Client Dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <motion.button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FcGoogle className="w-6 h-6" />
                                Sign in with Google
                            </>
                        )}
                    </motion.button>

                    {/* Info Text */}
                    <div className="mt-6 text-center">
                        <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
                            <p className="text-orange-300 text-xs font-medium mb-1">💡 Quick Start Guide:</p>
                            <p className="text-gray-300 text-xs">
                                <span className="text-green-300 font-medium">Students:</span> Use your @student.moringaschool.com email<br/>
                                <span className="text-blue-300 font-medium">Clients:</span> Use any personal Gmail account
                            </p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl"
                        >
                            <p className="text-red-300 text-sm font-medium text-center">{error}</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoogleAuth;
