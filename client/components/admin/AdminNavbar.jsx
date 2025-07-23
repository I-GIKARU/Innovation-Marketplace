"use client";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Image from "next/image";
import Form from "./AddModal";
import AvatarDropdown from "@/components/AvatarDropdown";

export default function Navbar({onSearch}) {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");


  const handleSearch = (e) =>{
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }
  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(`${productData.name} added successfully!`);
      } else {
        const errorData = await response.json();
        alert("Failed to add product: " + errorData.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <>
      <div className="bg-white p-4 shadow rounded-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

        
          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full w-full max-w-md">
              <Search className="text-gray-400 mr-2" size={16} />
              <input type="text"
                placeholder="Search"
                value={query}
                onChange={handleSearch}
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>

          
          <div className="flex items-center gap-4 ml-6">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowForm(true)}>
              <Plus className="cursor-pointer text-gray-600 hover:text-gray-800" />
            </button>
         
            <AvatarDropdown/>
            <span className="text-gray-700 font-medium">Paul</span>
          </div>
        </div>
      </div>

     
      {showForm && (
        <Form onCancel={() => setShowForm(false)} onSubmit={handleAddProduct}/>
        
      )}
    </>
  );
}
