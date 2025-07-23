'use client';

import React from 'react';
import { FiFilter, FiShoppingCart, FiUser } from 'react-icons/fi';
import Link from "next/link";
import Image from "next/image";
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
      <nav className="bg-white shadow-md py-4 px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                  src="/images/marketlogo.JPG"
                  alt="Moringa Marketplace Logo"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
              />
            </Link>
          </div>

          {/* Search Input */}
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

          {/* Navigation Icons */}
          <div className="flex items-center gap-6 text-gray-700">
            <Link href="/e_commerce/cart">
              <button className="hover:text-black relative" aria-label="Cart">
                <FiShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </Link>
            <button className="hover:text-black" aria-label="User">
              <FiUser size={22} />
            </button>
          </div>

        </div>
      </nav>
  );
};

export default Navbar;
