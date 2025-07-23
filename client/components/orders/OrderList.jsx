'use client';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import Sidebar from "@/components/student/Sidebar";
import AvatarDropdown from "@/components/AvatarDropdown";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import { useState, useEffect } from "react";

export default function OrderList() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const { orders, loading, pagination, setPagination, cancelOrder } = useOrders(user);

  // if (user === null) return <p>Loading...</p>;
  // if (user === undefined) {
  //   router.push("/login");
  //   return null;
  // }
  useEffect(() => {
    if (user === undefined) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };
  if (!user) return null;

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

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

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Order Management</h2>
            <OrderFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <OrderTable 
            orders={filteredOrders} 
            loading={loading} 
            onCancel={cancelOrder}
            pagination={pagination}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </div>
      </main>
    </div>
  );
}