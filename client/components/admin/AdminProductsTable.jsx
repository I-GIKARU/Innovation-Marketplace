import React, { useEffect } from 'react';
import { useMerchandise } from '@/hooks/useMerchandise'; // adjust path if needed

const ProductsTable = () => {
  const {
    merchandise,
    fetchMerchandise,
    loading,
    error
  } = useMerchandise();

  useEffect(() => {
    fetchMerchandise(); // Fetch on mount
  }, [fetchMerchandise]);

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
          </tr>
          </thead>
          <tbody>
          {merchandise.map((item, idx) => (
              <tr key={idx} className="border-t text-gray-800">
                <td className="px-4 py-2">{item.name || 'Unnamed'}</td>
                <td className="px-4 py-2">{item.price != null ? item.price : 'N/A'}</td>
                <td className="px-4 py-2">{item.stock != null ? item.stock : 'N/A'}</td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default ProductsTable;
