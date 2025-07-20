import React from 'react';

const productList = [
  { name: 'Hoodie', price: 2000, stock: 15 },
  { name: 'Mug', price: 800, stock: 30 },
  { name: 'Notebook', price: 500, stock: 0 },
  { name: 'Water Bottle', price: 1200, stock: 12 },
];

const ProductsTable = () => {
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
          {productList.map((item, idx) => (
            <tr key={idx} className="border-t text-gray-800">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.price}</td>
              <td className="px-4 py-2">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
