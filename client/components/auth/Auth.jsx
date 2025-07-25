"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { RiLoginCircleLine, RiUserAddLine, RiMailLine, RiLockLine, RiUser3Line, RiShieldUserLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const Auth = ({ initialTab = "login", onClose }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedRole, setSelectedRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const router = useRouter();
    const { login, register, loading, error } = useAuth();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const redirectToDashboard = (role) => {
        router.push(`/dashboard/${role}`);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login(formData.email, formData.password);
        if (res.success) redirectToDashboard(res.user.role);
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        const res = await register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
        });
        if (res.success) redirectToDashboard(res.user.role);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Background with glassmorphism */}
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5 rounded-3xl"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/30 to-orange-600/30 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500/25 to-orange-300/25 rounded-full blur-xl transform -translate-x-8 translate-y-8"></div>
                
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:scale-110 group border border-white/20"
                    >
                        <XMarkIcon className="w-6 h-6 text-white group-hover:text-orange-300 transition-colors duration-300" />
                    </button>
                )}
                
                <div className="relative z-10 p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl border border-orange-400/30"
                        >
                            {activeTab === "login" ? (
                                <RiLoginCircleLine className="w-10 h-10 text-white" />
                            ) : (
                                <RiUserAddLine className="w-10 h-10 text-white" />
                            )}
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3"
                        >
                            {activeTab === "login" ? "Welcome Back" : "Join Innovation Market"}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-gray-300 text-base"
                        >
                            {activeTab === "login" 
                                ? "Sign in to access your creative dashboard" 
                                : "Join our innovation marketplace and showcase your creativity"}
                        </motion.p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/20">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                                activeTab === "login"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <RiLoginCircleLine className="w-5 h-5" />
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                                activeTab === "register"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <RiUserAddLine className="w-5 h-5" />
                            Register
                        </button>
                    </div>

                    {/* Forms */}
                    <AnimatePresence mode="wait">
                        {activeTab === "login" ? (
                            <motion.form
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleLogin}
                                className="space-y-5"
                            >
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <RiMailLine className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <RiLockLine className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter your password"
                                            className="w-full pl-12 pr-12 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors duration-300" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors duration-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <RiLoginCircleLine className="w-5 h-5" />
                                            Sign In
                                        </>
                                    )}
                                </motion.button>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl"
                                    >
                                        <p className="text-red-300 text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRegister}
                                className="space-y-5"
                            >
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <RiUser3Line className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <RiUser3Line className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiMailLine className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiLockLine className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        className="w-full pl-12 pr-12 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors duration-300" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-orange-400 transition-colors duration-300" />
                                        )}
                                    </button>
                                </div>

                                {/* Role Selection */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <RiShieldUserLine className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <ModernRoleMenu
                                        selectedRole={selectedRole}
                                        setSelectedRole={setSelectedRole}
                                        roles={["student", "client"]}
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <RiUserAddLine className="w-5 h-5" />
                                            Create Account
                                        </>
                                    )}
                                </motion.button>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl"
                                    >
                                        <p className="text-red-300 text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const ModernRoleMenu = ({ selectedRole, setSelectedRole, roles }) => (
    <Menu as="div" className="relative w-full">
        <Menu.Button className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-left flex items-center justify-between hover:bg-white/15">
            <span className="text-white font-medium">
                {selectedRole === "student" ? "Student" : "Client"}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Menu.Items className="absolute z-20 mt-2 w-full bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 focus:outline-none overflow-hidden">
            <div className="py-2">
                {roles.map((role) => (
                    <Menu.Item key={role}>
                        {({ active }) => (
                            <button
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`w-full text-left px-6 py-4 text-sm transition-all duration-300 flex items-center gap-3 font-medium ${
                                    active 
                                        ? "bg-orange-500/20 text-orange-300" 
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                <RiShieldUserLine className="h-5 w-5" />
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        )}
                    </Menu.Item>
                ))}
            </div>
        </Menu.Items>
    </Menu>
);

export default Auth;
