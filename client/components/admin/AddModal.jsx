"use client";

import React, { useEffect, useState } from "react";

const Form = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    availablestock: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        availablestock: initialData.stock || "",
      });
    } else {
      setFormData({ name: "", price: "", availablestock: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setSuccessMessage(
      `${initialData ? "Updated" : "Added"} ${formData.name} successfully!`
    );
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {successMessage && (
        <p className="text-green-600 font-medium mb-2">{successMessage}</p>
      )}
      <div className="flex flex-col md:flex-row gap-4">
        <input name="name" value={formData.name}  onChange={handleChange}  placeholder="Product name"className="border px-3 py-2 rounded w-full"
          required/>
  
        <input name="price" type="number" value={formData.price}  onChange={handleChange} placeholder="Price" className="border px-3 py-2 rounded w-full"
          required/>
       
        <input name="availablestock" type="number"  value={formData.availablestock} onChange={handleChange} placeholder="Stock" className="border px-3 py-2 rounded w-full"
       required/>
       
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        {initialData ? "Update" : "Add"}
        </button>
        <button  type="button" onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">

          Cancel
        </button>
      </div>
    </form>
  );
};

export default Form;
