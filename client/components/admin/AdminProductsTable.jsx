import React from 'react';
import { FilePen, Trash } from "lucide-react";

const ProductsTable = ({
  merchandise,
  loading,
  error,
  fetchMerchandise,
  onEdit,
}) => {
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;

    const response = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert("Product deleted!");
      fetchMerchandise();
    } else {
      alert("Failed to delete product.");
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Price (Ksh)</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(merchandise) ? merchandise : []).map((item) => (
            <tr key={item.id} className="border-t text-gray-800">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.stock}</td>
              <td className="px-4 py-2 flex justify-around">
                <button onClick={() => onEdit(item)}>
                  <FilePen size={15} color="rgb(36, 174, 87)" />
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <Trash size={15} color="rgb(224, 94, 94)" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
