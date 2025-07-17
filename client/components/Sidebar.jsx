// components/Sidebar.js
"use client";
import { Home, Layers, Briefcase, RefreshCcw, LogOut } from "lucide-react";
import Link from "next/link";
export default function Sidebar() {
  return (
    <aside className="w-16 h-screen bg-white flex flex-col items-center py-4 gap-6 border-r">
      <div className="text-2xl font-bold">☰</div>
      <Link href="/" className="flex items-center gap-2">
        {" "}
        <Home className="text-orange-500" />
      </Link>
      <Layers />
      <Briefcase />
      <RefreshCcw />
      <LogOut className="mb-4 cursor-pointer" />
    </aside>
  );
}
