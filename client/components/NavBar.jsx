'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { RiDashboardLine, RiLoginCircleLine } from "react-icons/ri";
import { FiChevronDown, FiUpload, FiLogOut, FiSettings, FiUser, FiShoppingBag, FiFolder, FiHeart } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";



const NavBar = ({ onNavigate, onShowAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClientContent, setShowClientContent] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout, loading } = useAuthContext();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setShowClientContent(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/e_commerce", label: "Marketplace" },
  ];


  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };



  // Helper function to get the correct dashboard URL based on user role
  const getDashboardUrl = () => {
    if (!user || !user.role) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'student':
        return '/dashboard/student';
    case 'client':
      return '/dashboard/client';
    default:
      return '/';
    }
  };

  // Helper function to get dashboard label based on user role
  const getDashboardLabel = () => {
    if (!user || !user.role) return 'Portal';
    
    switch (user.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'student':
        return 'Student Dashboard';
    case 'client':
      return 'Client Dashboard';
    default:
      return 'Dashboard';
    }
  };

  return (
      <nav className="bg-gradient-to-r from-[#0a1128]/95 via-slate-900/95 to-[#0a1128]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Mobile logo text - shorter and more compact */}
              <div className="ml-2 sm:ml-4 block">
                <div className="flex items-baseline">
                  <span className="text-base sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">InnoMarket</span>
                  <span className="text-base sm:text-xl font-bold text-white ml-1 hidden sm:inline">place</span>
                </div>
                <div className="text-xs font-medium text-gray-300 -mt-1 tracking-wider hidden sm:block">CREATIVE MARKETPLACE</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group backdrop-blur-sm ${
                          pathname === link.href
                              ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25"
                              : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                      }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {loading && (
                <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {showClientContent && !loading && !isAuthenticated && (
                  <button
                      onClick={onShowAuth}
                      className="group relative inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 font-semibold"
                      title="Access Portal"
                  >
                    <RiLoginCircleLine size={20} className="mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Login</span>
                  </button>
              )}
              
              {showClientContent && !loading && isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-orange-400/50"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FiUser size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold max-w-32 truncate">{user?.email}</span>
                    <FiChevronDown size={16} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 py-3 z-50">
                      {/* Dashboard Link */}
                      <Link
                        href={getDashboardUrl()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-6 py-4 text-sm text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 hover:text-orange-400 transition-all duration-300 font-medium rounded-lg mx-2"
                      >
                        <RiDashboardLine size={18} className="mr-4 text-orange-400" />
                        {getDashboardLabel()}
                      </Link>

                      {/* User Email Display */}
                      <div className="px-6 py-4 border-t border-b border-orange-500/20 mx-2">
                        <p className="text-sm text-gray-300 font-medium truncate max-w-full" title={user?.email}>{user?.email}</p>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-4 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 font-medium rounded-lg mx-2"
                      >
                        <FiLogOut size={18} className="mr-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
              
            {/* Mobile menu button */}
            <button
                onClick={toggleMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-orange-400 hover:bg-white/10 transition-all duration-300"
                aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                  <HiX size={20} className="transform rotate-180 transition-transform duration-300" />
              ) : (
                  <HiMenu size={20} className="transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-[#0a1128] to-slate-900 border-t border-white/10">
            {/* Show general nav links for all users */}
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-block px-3 py-2 mr-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        pathname === link.href
                            ? "text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                    }`}
                    onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
            ))}
            
            {loading && (
              <div className="flex items-center justify-center px-4 py-3 mt-4">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading...</span>
              </div>
            )}
            
            {showClientContent && !loading && !isAuthenticated && (
                <button
                    onClick={() => {
                      onShowAuth();
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-2 mt-3 text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
                >
                  <RiLoginCircleLine size={16} />
                  <span>Login</span>
                </button>
            )}
            
            {showClientContent && !loading && isAuthenticated && (
              <div className="space-y-3">
                {/* Dashboard Link */}
                <Link
                    href={getDashboardUrl()}
                    className="flex items-center gap-3 px-4 py-3 text-white bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-orange-600/30 hover:border-orange-400/50 transition-all duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                >
                  <RiDashboardLine size={20} className="text-orange-400" />
                  <span>{getDashboardLabel()}</span>
                </Link>
                
                {/* User Email Display */}
                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                      <FiUser size={14} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-300 font-medium truncate max-w-full" title={user?.email}>{user?.email}</p>
                  </div>
                </div>
                
                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 hover:border-red-400/30 transition-all duration-200 font-medium"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
  );
};

export default NavBar;
