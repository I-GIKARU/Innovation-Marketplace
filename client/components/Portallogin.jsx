"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Portallogin = ({ closeParentDropdown }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [selectedRole, setSelectedRole] = useState("student");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeParentDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeParentDropdown]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 ring"
    >
      <div className="flex justify-around">
        <button
          onClick={() => setActiveTab("login")}
          className={`w-1/2 py-2 font-medium ${
            activeTab === "login"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`w-1/2 py-2 font-medium ${
            activeTab === "register"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Register
        </button>
      </div>

      {activeTab === "login" ? (
        <form className="px-6 py-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="kimdan@gmail.com"
            className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
            required
          />

          <label className="mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="********"
            className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>
      ) : (
        <form className="px-6 py-4 flex flex-col">
          <label className="mb-2 text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
            required
          />

          <label className="mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="kimdan@gmail.com"
            className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
            required
          />

          <label className="mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="********"
            className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
            required
          />

          {/* Role Selection */}
          <label className="mb-2 text-sm font-medium">Select Role</label>
          <Menu as="div" className="relative mb-3">
            <div>
              <Menu.Button className="inline-flex w-full justify-between rounded px-3 py-2 text-sm font-medium text-gray-700 bg-white shadow-xs ring-1 ring-gray-300 hover:bg-gray-50">
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
              </Menu.Button>
            </div>

            <Menu.Items className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="py-1">
                {["student", "client", "admin"].map((role) => (
                  <Menu.Item key={role}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block w-full text-left px-4 py-2 text-sm`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Portallogin;
