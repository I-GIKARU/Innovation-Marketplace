// components/Sidebar.js
"use client";
import { Home, Layers, Briefcase, RefreshCcw } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-16 h-screen bg-white flex flex-col items-center py-4 gap-6 border-r">
      <div className="text-2xl font-bold">☰</div>
      <Home className="text-orange-500" />
      <Layers />
      <Briefcase />
      <RefreshCcw />
    </aside>
  );
}
