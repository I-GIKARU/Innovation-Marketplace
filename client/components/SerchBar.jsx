"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); 
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search"
      className="px-4 py-2 rounded-full bg-white shadow-sm focus:outline-none w-64"
    />
  );
}
