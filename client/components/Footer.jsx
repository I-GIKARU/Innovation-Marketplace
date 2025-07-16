import React from 'react';
import { FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaCopyright } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a1128] text-white py-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <img className="h-auto max-w-full" src="/images/marketplace.png" alt="Logo"/>
        </div>

        <nav className="flex flex-wrap justify-center space-x-6 text-sm font-semibold">
          <a href="#" className="hover:text-orange-500">Projects</a>
          <a href="#" className="hover:text-orange-500">Merchandise</a>
          <a href="#" className="hover:text-orange-500">Contact</a>
          <a href="#" className="hover:text-orange-500">Explore Projects</a>
        </nav>

        <div className="text-center">
          <p className="mb-4">stay in touch</p>
          <div className="flex justify-center space-x-6 text-xl">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-400 pt-6">
          <FaCopyright />
          <p>moringa marketplace - all rights are reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
