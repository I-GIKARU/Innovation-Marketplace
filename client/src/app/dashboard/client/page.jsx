"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/student/Sidebar";

export default function ClientDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return <p>Loading...</p>;

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 p-4 bg-green-100 rounded shadow">
                    <h1 className="text-2xl font-semibold">
                        Welcome, {user.name || "Client"}!
                    </h1>
                    <p className="text-gray-700">Email: {user.email}</p>
                </div>

                <h2 className="text-lg font-bold mb-2">Client Dashboard</h2>
                <p>Manage your orders</p>


            </main>
        </div>
    );
}
