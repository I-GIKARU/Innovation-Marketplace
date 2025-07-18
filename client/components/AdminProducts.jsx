import React, { useState } from 'react';
import ProductsTable from './AdminProductsTable';

const Products = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Products</h2>
      <p className="text-gray-600">Merchandise available at our store</p>
      <button onClick={() => setShowDetails(!showDetails)}  
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"  >
        View Details
      </button>

      {showDetails && <ProductsTable />}
    </section>
  );
};

export default Products;

