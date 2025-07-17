// components/Topbar.js
"use client";
import { Search, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
      <h1 className="text-xl font-bold">Portfolio</h1>
      <div className="flex items-center gap-4 flex-1 mx-4">
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full w-full max-w-md">
          <Search className="text-gray-400 mr-2" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full"
          />
        </div>
        <Plus className="cursor-pointer" />
        <ShoppingCart />
        <Image
          src="/images/profile.jpg"
          alt="Ann"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>Ann</span>
      </div>
    </div>
  );
}
