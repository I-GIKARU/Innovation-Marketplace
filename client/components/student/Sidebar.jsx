"use client";

import {
    Home,
    Layers,
    Briefcase,
    RefreshCcw,
    LogOut,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Sidebar() {
    const { logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef();

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                window.innerWidth < 768 // only auto-close on mobile
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <aside
        ref={sidebarRef}
        className={`fixed z-40 top-0 left-0 h-screen bg-white border-r transition-all duration-300 ease-in-out shadow-lg
        ${isOpen ? "w-64 px-4" : "w-16"}
        md:static md:translate-x-0 flex flex-col justify-between`}
      >
        <div>
          <button
            onClick={toggleSidebar}
            className="mt-4 text-gray-500 hover:text-gray-800 transition"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>

          <div className="mt-6 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Home className="text-orange-500" />
              {isOpen && <span className="text-sm">Home</span>}
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/merchandise" className="flex items-center gap-3">
                <Layers />
              </Link>
              {isOpen && <span className="text-sm">Projects</span>}
            </div>

            <div className="flex items-center gap-3">
              <Briefcase />
              {isOpen && <span className="text-sm">Work</span>}
            </div>

            <div className="flex items-center gap-3">
              <RefreshCcw />
              {isOpen && <span className="text-sm">Sync</span>}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:text-red-700"
          >
            <LogOut />
            {isOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>
    );
}
