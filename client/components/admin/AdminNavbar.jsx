"use client";
import {useState} from "react";
import { Search } from "lucide-react";
import AvatarDropdown from "@/components/AvatarDropdown";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white p-4 shadow-lg border-b border-gray mx-4 sm:mx-6 lg:mx-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
       
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
          Dashboard
        </h1>

       <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full md:max-w-md focus-within:ring-2 focus-within:ring-blue-200 transition-shadow">
          <Search className="text-gray-400 mr-2" size={16} />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={handleSearch}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

       
        <div className="flex items-center gap-2 md:gap-4">
          <AvatarDropdown />
          <span className="text-gray-700 font-medium text-sm sm:text-base">Admin</span>
        </div>
      </div>
    </div>
  );
}
