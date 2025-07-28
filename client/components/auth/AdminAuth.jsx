"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const AdminAuth = ({ onClose }) => {
    const router = useRouter();
    const { adminLogin, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const redirectToDashboard = () => {
        router.push(`/dashboard/admin`);
    };

    const handleAdminLogin = async () => {
        const res = await adminLogin(email, password);
        if (res.success) {
            redirectToDashboard();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
                {/* Minimal decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-blue-600/3 rounded-2xl"></div>

                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 group"
                    >
                        <XMarkIcon className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors duration-200" />
                    </button>
                )}

                <div className="relative z-10 p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Admin Login
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Enter your credentials to access the admin panel
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/40 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/40 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                        />

                        <motion.button
                            onClick={handleAdminLogin}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </motion.button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                            <p className="text-red-300 text-sm font-medium text-center">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAuth;

