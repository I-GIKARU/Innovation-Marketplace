"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/useAuth";

const Auth = ({ initialTab = "login" }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedRole, setSelectedRole] = useState("student");

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
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            {/* Tabs */}
            <div className="flex justify-around mb-6">
                <button
                    onClick={() => setActiveTab("login")}
                    className={`w-1/2 py-2 font-medium text-center transition ${
                        activeTab === "login"
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab("register")}
                    className={`w-1/2 py-2 font-medium text-center transition ${
                        activeTab === "register"
                            ? "border-b-2 border-green-600 text-green-600"
                            : "text-gray-500 hover:text-green-500"
                    }`}
                >
                    Register
                </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kimdan@gmail.com"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <label className="mb-1 text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            ) : (
                <form onSubmit={handleRegister} className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <label className="mb-1 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="kimdan@gmail.com"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <label className="mb-1 text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                        className="mb-4 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    />

                    <label className="mb-1 text-sm font-medium text-gray-700">Select Role</label>
                    <RoleMenu
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        roles={["student", "client"]}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            )}
        </div>
    );
};

const RoleMenu = ({ selectedRole, setSelectedRole, roles }) => (
    <Menu as="div" className="relative mb-4">
        <Menu.Button className="inline-flex w-full justify-between rounded px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50">
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
        </Menu.Button>
        <Menu.Items className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none">
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
