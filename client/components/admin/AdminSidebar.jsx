'use client';

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
    Menu,
    House,
    ShoppingBag,
    BriefcaseBusiness,
    ChartColumnStacked,
    ShoppingCart,
    LogOut,
    User,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const menu = [
    { name: "Dashboard", key: "dashboard", icon: House, description: "Overview & Analytics" },
    { name: "Products", key: "products", icon: ShoppingBag, description: "Manage products" },
    { name: "Projects", key: "projects", icon: BriefcaseBusiness, description: "Project management" },
    { name: "Orders", key: "orders", icon: ShoppingCart, description: "Order tracking" },
    { name: "Categories", key: "categories", icon: ChartColumnStacked, description: "Category management" },
];

function Sidebar({ onSelect }) {
    const { logout, user } = useAuth();
    const [isSideBarOpen, setSideBarIsOpen] = useState(true);
    const [activeItem, setActiveItem] = useState("dashboard");

    const handleSelect = (key) => {
        setActiveItem(key);
        onSelect(key); // call parent with selected key
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <div className={`relative z-20 transition-all duration-300 ease-in-out ${isSideBarOpen ? 'w-72' : 'w-20'} bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 shadow-2xl border-r border-gray-700`}>
            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <button 
                        onClick={() => setSideBarIsOpen(!isSideBarOpen)}
                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200"
                    >
                        {isSideBarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    {isSideBarOpen && (
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Settings size={16} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                                <p className="text-xs text-gray-400">Management Dashboard</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-2">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.key === activeItem;
                        return (
                            <div key={item.key} className="relative">
                                <button
                                    onClick={() => handleSelect(item.key)}
                                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                                        ${
                                            isActive 
                                                ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
                                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50 hover:transform hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                                        isActive ? 'bg-blue-500' : 'bg-gray-700 group-hover:bg-gray-600'
                                    } transition-all duration-200`}>
                                        <Icon size={20} className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'} />
                                    </div>
                                    {isSideBarOpen && (
                                        <div className="ml-3 flex-1 text-left">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs opacity-75">{item.description}</div>
                                        </div>
                                    )}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

export default Sidebar;
