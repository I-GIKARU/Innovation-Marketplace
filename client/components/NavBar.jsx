'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClientContent, setShowClientContent] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setShowClientContent(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/e_commerce", label: "Merchandise" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
      <nav className="bg-white shadow-md px-6 md:px-10 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
                src="/images/marketlogo.JPG"
                alt="Moringa Marketplace Logo"
                width={60}
                height={60}
                className="rounded-full h-10 w-10 object-cover"
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
            {showClientContent && !isAuthenticated && (
                <li>
                  <Link
                      href="pages/auth"
                      className="text-orange-600 hover:underline font-semibold"
                  >
                    Portal
                  </Link>
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
                  <li>
                    <Link
                        href="pages/auth"
                        className="text-white bg-orange-500 px-4 py-2 rounded hover:bg-orange-600 transition"
                        onClick={() => setIsOpen(false)}
                    >
                      Portal
                    </Link>
                  </li>
              )}
            </ul>
        )}
      </nav>
  );
};

export default NavBar;
