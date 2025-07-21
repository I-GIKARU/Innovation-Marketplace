"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Auth from "@/components/auth/Auth";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalDropdownOpen, setIsPortalDropdownOpen] = useState(false);
  const [showClientContent, setShowClientContent] = useState(false);

  const portalDropdownRef = useRef(null);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setShowClientContent(true); // ensure auth-dependent content renders only on client
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        portalDropdownRef.current &&
        !portalDropdownRef.current.contains(event.target)
      ) {
        setIsPortalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/e_commerce", label: "Merchandise" },
    { href: "/contact", label: "Contact" },
  ];

  const togglePortalDropdown = () => {
    setIsPortalDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 md:px-10 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
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
            <span className="text-xs font-light text-gray-700">
              marketplace
            </span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-orange-600 focus:outline-none"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Desktop Nav */}
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

          {/* Conditionally render Portal after mount */}
          {showClientContent && !isAuthenticated && (
            <li className="relative" ref={portalDropdownRef}>
              <button
                onClick={togglePortalDropdown}
                className="pb-1 border-b-2 border-transparent hover:border-orange-300"
              >
                Portal
              </button>
              {isPortalDropdownOpen && (
                <div className="absolute right-0 mt-2">
                  <Auth closeParentDropdown={() => setIsPortalDropdownOpen(false)} />
                </div>
              )}
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Nav */}
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

          {showClientContent && !isAuthenticated && (
            <li className="relative" ref={portalDropdownRef}>
              <button
                onClick={togglePortalDropdown}
                className="text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Portal
              </button>
              {isPortalDropdownOpen && (
                <div className="mt-2">
                  <Auth closeParentDropdown={() => setIsPortalDropdownOpen(false)} />
                </div>
              )}
            </li>
          )}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
