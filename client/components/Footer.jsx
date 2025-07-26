import React from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a1128] text-white py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          {/* Logo */}
          <div className="flex-shrink-0 order-1 lg:order-1">
            <img className="h-8 w-auto mx-auto lg:mx-0" src="/images/marketplace.png" alt="Logo"/>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm font-semibold order-3 lg:order-2">
            <a href="#" className="hover:text-orange-500 transition-colors">Projects</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Merchandise</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Explore Projects</a>
          </nav>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 order-2 lg:order-3">
            <span className="text-sm text-gray-300 text-center sm:inline">Stay in touch:</span>
            <div className="flex space-x-4 text-lg">
              <a href="#" className="hover:text-orange-500 transition-colors p-2 hover:bg-orange-500/10 rounded-lg"><FaTwitter /></a>
              <a href="#" className="hover:text-orange-500 transition-colors p-2 hover:bg-orange-500/10 rounded-lg"><FaLinkedin /></a>
              <a href="#" className="hover:text-orange-500 transition-colors p-2 hover:bg-orange-500/10 rounded-lg"><FaInstagram /></a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 text-xs text-gray-300">
            {/* Contact info */}
            <div className="flex flex-col sm:flex-row text-center lg:text-left space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="break-words">Contact: info@moringamarketplace.com | +254 700 123 456</span>
              <span className="hidden sm:inline">|</span>
              <span>Location: Nairobi, Kenya | Office Hours: Mon-Fri 9AM-6PM EAT</span>
            </div>
            
            {/* Copyright */}
            <div className="flex items-center justify-center space-x-1 text-gray-400 mt-2 lg:mt-0">
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
