import React from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a1128] text-white py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-8 w-auto" src="/images/marketplace.png" alt="Logo"/>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center space-x-6 text-sm font-semibold">
            <a href="#" className="hover:text-orange-500 transition-colors">Projects</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Merchandise</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Explore Projects</a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300 hidden md:inline">Stay in touch:</span>
            <div className="flex space-x-3 text-lg">
              <a href="#" className="hover:text-orange-500 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><FaLinkedin /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-4 pt-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs text-gray-300">
            {/* Contact info */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-1 md:space-y-0">
              <span>Contact: info@moringamarketplace.com | +254 700 123 456</span>
              <span className="hidden md:inline">|</span>
              <span>Location: Nairobi, Kenya | Office Hours: Mon-Fri 9AM-6PM EAT</span>
            </div>
            
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-gray-400">
              <FaCopyright />
              <span>moringa marketplace - all rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
