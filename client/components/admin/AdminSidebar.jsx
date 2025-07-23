'use client';

import Link from "next/link";
import React, {useState} from "react";
import { usePathname } from "next/navigation";
import {Menu, House,
  ShoppingBag,
  BriefcaseBusiness,
  ChartColumnStacked,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const menu = [
  { name: "Dashboard", href: "/", icon: House },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { name: "Categories", href: "/categories", icon: ChartColumnStacked },

];


function Sidebar() {
  const { logout, user} = useAuth();
  const pathname = usePathname();
  const [isSideBarOpen, setSideBarIsOpen]= useState(true)


  const handleLogout = async () => {
    await logout();
    window.location.href = "/"; // or router.push('/login')
  };

  return (
    <div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSideBarOpen? "w-64": "w-20"}`}>
      <div className="h-full bg-[#1e1e1e]backdrop-blur-md p-4 flex flex-col border-r">
        <button onClick={()=> setSideBarIsOpen(!isSideBarOpen)} 
            className="p-2 rounded-full hover:bg-[#2f2f2f] hover:text-white transition-colors max-w-fit cursor-pointer">
            <Menu size={24}  />
        </button>
        <nav className="mt-8 flex-grow">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#2f2f2f] hover:text-white transition-colors mb-2 ${
                    pathname === item.href ? "bg-[#2f2f2f]" : ""
                  }`}
                >
                  <Icon size={20} style={{ minWidth: "20px" }} />
                  {isSideBarOpen &&(<span className="ml-4 whitespace-nowrap">{item.name}</span>)}
                </div>
              </Link>
            );
          })}
   </nav>
   {user && (
    <button
  onClick={handleLogout}
  className="w-full mt-4 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-md bg-red-500 text-white hover:bg-red-600 transition"
   >
  Logout  
</button>
   ) 
}

     

      </div>
    </div>
  );
}

export default Sidebar;
