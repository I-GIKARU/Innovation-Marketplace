'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useMerchandise } from '@/hooks/useMerchandise';

const ProductList = () => {
  const { merchandise, loading, error, fetchMerchandise } = useMerchandise();

  useEffect(() => {
    const load = async () => {
      await fetchMerchandise();
    };
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 text-gray-900">
        Shop Products
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Browse our curated selection of merchandise.
      </p>

      {loading && (
        <p className="text-gray-500 text-center">Loading products...</p>
      )}
      {error && (
        <p className="text-red-600 text-center">Error: {error}</p>
      )}

      {!loading && merchandise.length === 0 && (
        <p className="text-center">No merchandise available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {merchandise.map((product) => (
          <div
            key={product.id}
            className="group border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white"
          >
            <img
              src={
                product.image_url ||
                JSON.parse(product.image_urls || '[]')[0] ||
                '/images/default.png'
              }
              alt={product.name}
              className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-[#00B386] font-bold mb-4">
                KES {product.price}
              </p>

              <Link href={`/e_commerce/product/${product.id}`}>
                <button className="w-full bg-[#00B386] text-white px-4 py-2 rounded-lg hover:bg-[#009973] transition-colors duration-300">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
