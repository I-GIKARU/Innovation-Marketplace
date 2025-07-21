// components/Auth.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/useAuth";

const Auth = ({ closeParentDropdown }) => {
    const [activeTab, setActiveTab] = useState("login");
    const [selectedRole, setSelectedRole] = useState("student"); // Only used in register
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const dropdownRef = useRef(null);
    const router = useRouter();
    const { login, register, loading, error } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeParentDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeParentDropdown]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const redirectToDashboard = (role) => {
        router.push(`/dashboard/${role}`);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login({
            email: formData.email,
            password: formData.password,
        });
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
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-80 bg-white/30 backdrop-invert backdrop-opacity-95 border border-orange-300 rounded-xl text-orange-500 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Tabs */}
            <div className="flex justify-around">
                <button
                    onClick={() => setActiveTab("login")}
                    className={`w-1/2 py-2 font-medium ${
                        activeTab === "login"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab("register")}
                    className={`w-1/2 py-2 font-medium ${
                        activeTab === "register"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    Register
                </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="px-6 py-4 flex flex-col">
                    <label className="mb-2 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kimdan@gmail.com"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />

                    <label className="mb-2 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            ) : (
                <form onSubmit={handleRegister} className="px-6 py-4 flex flex-col">
                    <label className="mb-2 text-sm font-medium">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />
                    
                    <label className="mb-2 text-sm font-medium">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />

                    <label className="mb-2 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kimdan@gmail.com"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />

                    <label className="mb-2 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                        required
                    />

                    <label className="mb-2 text-sm font-medium">Select Role</label>
                    <RoleMenu
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        roles={["student", "client"]}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            )}
        </div>
    );
};

const RoleMenu = ({ selectedRole, setSelectedRole, roles }) => (
    <Menu as="div" className="relative mb-3">
        <Menu.Button className="inline-flex w-full justify-between rounded px-3 py-2 text-sm font-medium text-gray-700 bg-white shadow-xs ring-1 ring-gray-300 hover:bg-gray-50">
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Menu.Items className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
                {roles.map((role) => (
                    <Menu.Item key={role}>
                        {({ active }) => (
                            <button
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                className={`${
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                } block w-full text-left px-4 py-2 text-sm`}
                            >
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
