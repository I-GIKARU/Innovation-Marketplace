"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 p-4 bg-purple-100 rounded shadow">
                    <h1 className="text-2xl font-semibold">
                        Welcome, {user.name || "User"}!
                    </h1>
                    <p className="text-gray-700">Email: {user.email}</p>
                    <p className="text-gray-600 mt-1">Role: <strong>{user.role}</strong></p>
                </div>

                <h2 className="text-lg font-bold mb-2">User Dashboard</h2>
                <p>Explore your activity, preferences, and settings.</p>

                <button
                    onClick={() => {
                        logout();
                        router.push("/");
                    }}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
                >
                    Logout
                </button>
            </main>
        </div>
    );
};

export default UserDashboard;
