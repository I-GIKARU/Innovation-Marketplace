"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GoogleAuth from "./GoogleAuth";
import AdminAuth from "./AdminAuth";

const CombinedAuth = ({ onClose }) => {
    const [authType, setAuthType] = useState("google"); // "google" or "admin"

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Tab Switcher */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-6 border border-white/20">
                <button
                    onClick={() => setAuthType("google")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        authType === "google"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Google Sign-In
                </button>
                <button
                    onClick={() => setAuthType("admin")}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        authType === "admin"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Admin
                </button>
            </div>

            {/* Auth Forms */}
            <AnimatePresence mode="wait">
                {authType === "google" ? (
                    <motion.div
                        key="google"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GoogleAuth onClose={onClose} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="admin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AdminAuth onClose={onClose} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CombinedAuth;
