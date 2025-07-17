"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import Register from "@/components/Register_login"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = ()=>{
    setIsDropdownOpen(prev => !prev);
  };
  const closeDropdown=()=>{
    setIsDropdownOpen(false)
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/merchandise", label: "Merchandise" },
    { href: "/contact", label: "Contact" },
    { href: "/explore", label: "Portal" },
  ];

  const dropdownRef = useRef(null);

  useEffect(()=>{
    const handleClickOutside=(event)=>{
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)){
        closeDropdown()
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return() =>{
      document.removeEventListener("mousedown", handleClickOutside)
    };
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 md:px-10 py-4">
      <div className="flex items-center justify-between">
    
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/marketlogo.JPG"
            alt="Moringa Marketplace Logo"
            width={60}
            height={500}
          />
          <div className="text-orange-600">
            <span className="text-xl font-bold font-serif">M</span>oringa
            <br />
            <span className="text-xs font-light text-gray-700">marketplace</span>
          </div>
        </Link>

        <button
          onClick={toggleMenu}
          className="md:hidden text-orange-600 focus:outline-none"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        <ul className="hidden md:flex gap-6 text-sm text-gray-800 font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`pb-1 border-b-2 ${
                  pathname === link.href
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent hover:border-orange-300"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
            <li className="relative" ref={dropdownRef}>
              <button
              onClick={toggleDropdown}
              className=" text-gray-800 hover:underline hover:decoration-orange-300 "
              >
                Login
              </button>
              {isDropdownOpen &&(
                <div className="absolute right-0 mt-2">
                  <Register closeParentDropdown={closeDropdown} />
                </div>
              )}
            </li>
        </ul>
      </div>

      {isOpen && (
        <ul className="flex flex-col mt-4 gap-4 md:hidden text-sm text-gray-800 font-medium">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block pb-1 border-b-2 ${
                  pathname === link.href
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent hover:border-orange-300"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="text-white px-4 py-2 rounded hover:bg-orange-500 transition"
              >
                Login
              </button>

              {isDropdownOpen && (
                <div className="mt-2">
                  <Register closeParentDropdown={closeDropdown} />
                </div>
              )}
            </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
