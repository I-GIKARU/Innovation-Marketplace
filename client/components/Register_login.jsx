"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // Adjust this import path if needed

const Register = ({ closeParentDropdown }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dropdownRef = useRef(null);
  const router = useRouter();
  const { login, register, loading, error } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
      ) {
        closeParentDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeParentDropdown]);

  const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login({ ...formData, role: "user" });
    if (res.success) router.push("/dashboard/user");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register({ ...formData, role: "user" });
    if (res.success) router.push("/dashboard/user");
  };

  return (
      <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 ring"
      >
        <div className="flex justify-around ">
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
            <form onSubmit={handleLogin} className="px-6 py-4 flex flex-col">
              <label className="mb-2 text-sm font-medium">Email</label>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kimdan@gmail.com"
                  className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                  required
              />

              <label className="mb-2 text-sm font-medium">Password</label>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                  required
              />

              <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        ) : (
            <form onSubmit={handleRegister} className="px-6 py-4 flex flex-col">
              <label className="mb-2 text-sm font-medium">Name</label>
              <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                  required
              />

              <label className="mb-2 text-sm font-medium">Email</label>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kimdan@gmail.com"
                  className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                  required
              />

              <label className="mb-2 text-sm font-medium">Password</label>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="mb-3 px-3 py-2 rounded focus:outline-none focus:ring-blue-400 hover:border"
                  required
              />

              <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
        )}
      </div>
  );
};

export default Register;
