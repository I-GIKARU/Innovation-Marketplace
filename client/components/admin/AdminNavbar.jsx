"use client";
import { Search, Plus } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
      
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-md">
            <Search className="text-gray-400 mr-2" size={16} />
            <input type="text" placeholder="Search" className="bg-transparent outline-none w-full"/>
          </div>
        </div>

       
        <div className="flex items-center gap-4 ml-6">
          <Plus className="cursor-pointer text-gray-600 hover:text-gray-800" />
          <Image src="/images/admin_profile.jpg" alt="paul"  width={32} height={32}  className="rounded-full"  />
          <span className="text-gray-700 font-medium">Paul</span>
        </div>
      </div>
    </div>
  );
}
