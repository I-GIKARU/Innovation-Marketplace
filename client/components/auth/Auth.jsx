"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { RiLoginCircleLine, RiUserAddLine, RiMailLine, RiLockLine, RiUser3Line, RiShieldUserLine, RiGraduationCapLine, RiBriefcaseLine } from "react-icons/ri";
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
        <div className="w-full max-w-md mx-auto">
            {/* Simplified background */}
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
                
                <div className="relative z-10 p-4 sm:p-6">
                    {/* Simplified Header */}
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            {activeTab === "login" ? (
                                <RiLoginCircleLine className="w-6 h-6 text-white" />
                            ) : (
                                <RiUserAddLine className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {activeTab === "login" ? "Welcome Back" : "Join InnoMarket"}
                        </h2>
                        <p className="text-gray-300 text-sm">
                            {activeTab === "login" 
                                ? "Sign in to your account" 
                                : "Create your account"}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-4 border border-white/20">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === "login"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <RiLoginCircleLine className="w-4 h-4" />
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === "register"
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <RiUserAddLine className="w-4 h-4" />
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
                                            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15 text-sm"
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
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <RiLoginCircleLine className="w-4 h-4" />
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
                                className="space-y-4"
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
                                            className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15 text-sm"
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
                                            className="w-full pl-10 pr-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15 text-sm"
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
                                        className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 hover:bg-white/15 text-sm"
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
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            <RiUserAddLine className="w-4 h-4" />
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

const roleConfig = {
    student: {
        icon: RiGraduationCapLine,
        label: "Student",
        description: "Looking for projects and learning opportunities",
        color: "text-blue-400"
    },
    client: {
        icon: RiBriefcaseLine,
        label: "Client",
        description: "Seeking innovative solutions for your business",
        color: "text-green-400"
    }
};

const ModernRoleMenu = ({ selectedRole, setSelectedRole, roles }) => {
    const selectedConfig = roleConfig[selectedRole];
    const SelectedIcon = selectedConfig.icon;
    
    return (
        <Menu as="div" className="relative w-full">
            <Menu.Button className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400/50 transition-all duration-300 bg-white/10 backdrop-blur-sm text-left flex items-center justify-between hover:bg-white/15 group">
                <div className="flex items-center gap-3">
                    <SelectedIcon className={`h-5 w-5 ${selectedConfig.color} group-hover:text-orange-400 transition-colors duration-200`} />
                    <div>
                        <span className="text-white font-medium text-sm">
                            {selectedConfig.label}
                        </span>
                        <p className="text-gray-400 text-xs mt-0.5 leading-tight">
                            {selectedConfig.description}
                        </p>
                    </div>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
            </Menu.Button>
            
            <Menu.Items className="absolute z-50 mt-2 w-full bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 focus:outline-none overflow-hidden bottom-full left-0 mb-2">
                <div className="py-2">
                    {roles.map((role) => {
                        const config = roleConfig[role];
                        const RoleIcon = config.icon;
                        const isSelected = selectedRole === role;
                        
                        return (
                            <Menu.Item key={role}>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedRole(role)}
                                        className={`w-full text-left px-4 py-4 transition-all duration-200 flex items-center gap-4 relative group ${
                                            active 
                                                ? "bg-orange-500/20 text-orange-300" 
                                                : "text-white hover:bg-white/10"
                                        } ${isSelected ? "bg-orange-500/10 border-l-2 border-orange-500" : ""}`}
                                    >
                                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                                            active ? "bg-orange-500/20" : "bg-white/10"
                                        }`}>
                                            <RoleIcon className={`h-5 w-5 ${
                                                active ? "text-orange-300" : config.color
                                            } transition-colors duration-200`} />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium text-sm ${
                                                    active ? "text-orange-300" : "text-white"
                                                } transition-colors duration-200`}>
                                                    {config.label}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                )}
                                            </div>
                                            <p className={`text-xs leading-tight mt-1 ${
                                                active ? "text-orange-200/80" : "text-gray-400"
                                            } transition-colors duration-200`}>
                                                {config.description}
                                            </p>
                                        </div>
                                        
                                        {/* Subtle hover indicator */}
                                        <div className={`w-1 h-8 rounded-full transition-all duration-200 ${
                                            active ? "bg-gradient-to-b from-orange-400 to-orange-600" : "bg-transparent"
                                        }`}></div>
                                    </button>
                                )}
                            </Menu.Item>
                        );
                    })}
                </div>
            </Menu.Items>
        </Menu>
    );
};

export default Auth;
