'use client';

import Image from "next/image";
import { useAuth } from "@/hooks/useAuth"; // adjust path as needed

function Sidebar({ onSelect }) {
    const menuItems = ['Dashboard', 'Products', 'Projects'];
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        // optionally: redirect to login page or show confirmation
        window.location.href = '/'; // adjust route as needed
    };

    return (
        <aside className="w-64 h-screen bg-[#E5E5E5] text-gray-800 fixed top-0 left-0 p-4">
            <div className="mb-6 flex items-center justify-center">
                <Image src="/images/marketlogo.JPG" alt="Marketplace Logo" width={42} height={42} />
            </div>

            <nav className="m-2 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => onSelect(item.toLowerCase())}
                        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition"
                    >
                        {item}
                    </button>
                ))}

                <hr className="my-4 border-gray-400" />

                {user && (
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;
