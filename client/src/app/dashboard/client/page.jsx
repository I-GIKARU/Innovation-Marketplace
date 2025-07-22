"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/student/Sidebar";
import AvatarDropdown from "@/components/student/AvatarDropdown";
import OrderList from "@/components/orders/OrderList";

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (user === null) return <p>Loading...</p>;
  if (user === undefined) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 p-4 bg-green-100 rounded shadow">
          <h1 className="text-2xl font-semibold">Welcome, {user.name || "Client"}!</h1>
          <div className="flex items-center justify-between mt-2 gap-4">
            <p className="text-gray-700">Email: {user.email}</p>
            <AvatarDropdown onLogout={handleLogout} />
          </div>
        </div>

        <h2 className="text-lg font-bold mb-2">Client Dashboard</h2>
        <OrderList />


      </main>
    </div>
  );
}
