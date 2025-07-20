import React from 'react';
import { FiFilter, FiShoppingCart, FiUser } from 'react-icons/fi';
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

       
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/marketlogo.JPG"
              alt="Moringa Marketplace Logo"
              width={60}
              height={60}
              className="rounded-lg object-contain"
            />
          </Link>
        </div>

        
        <div className="flex items-center flex-1 max-w-xl w-full justify-center gap-2">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full md:w-[400px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="text-gray-700 hover:text-black">
            <FiFilter size={22} />
          </button>
        </div>

       
        <div className="flex items-center gap-6 text-gray-700">
          <button className="hover:text-black">
            <FiShoppingCart size={22} />
          </button>
          <button className="hover:text-black">
            <FiUser size={22} />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
