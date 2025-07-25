'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';
import {
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ProductList = ({ onProductClick }) => {
  const { merchandise, loading, error, fetchMerchandise } = useMerchandise();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      await fetchMerchandise();
    };
    load();
  }, []);

  useEffect(() => {
    setFilteredProducts([...merchandise]);
  }, [merchandise]);

  const LoadingGrid = () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 rounded mb-4 w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
            </div>
        ))}
      </div>
  );

  const ProductCard = ({ product, index }) => (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 flex flex-col"
      >
        {/* Image */}
        <div className="relative">
          <img
              src={
                  product.image_url ||
                  JSON.parse(product.image_urls || '[]')[0] ||
                  '/images/default.png'
              }
              alt={product.name}
              className="w-full h-72 object-cover transition-transform duration-700"
          />
        </div>

        {/* Product Content */}
        <div className="p-6 flex flex-col h-full">
          <div className="mb-4">
            <div className="mb-2">
            <span className="text-xs text-[#0a1128] font-semibold uppercase tracking-wider">
              {product.category || 'Product'}
            </span>
            </div>

            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {product.description || 'Premium quality product with exceptional design and functionality.'}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                KES {product.price?.toLocaleString()}
              </span>
                <span className="text-sm text-gray-500 line-through">
                KES {Math.round(product.price * 1.25)?.toLocaleString()}
              </span>
              </div>
            </div>
            
            {/* Stock Information */}
            <div className="mb-4">
              {(product.quantity || 0) > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    {product.quantity > 10 ? 'In Stock' : 
                     product.quantity > 5 ? `Only ${product.quantity} left!` : 
                     product.quantity > 0 ? `Last ${product.quantity} items!` : 'Out of Stock'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => onProductClick?.(product)}
              className="w-full bg-[#0a1128] hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>
      </motion.div>
  );

  return (
      <section className="bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Centered Title */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop Products</h2>
            <p className="text-sm text-gray-600 mt-1">Quality products, competitive prices</p>
          </motion.div>

          {/* Loading State */}
          {loading && <LoadingGrid />}

          {/* Error State */}
          {error && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
              >
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                  <div className="text-red-600 text-lg font-semibold mb-2">Oops! Something went wrong</div>
                  <p className="text-red-500">{error}</p>
                </div>
              </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
                  <button
                      onClick={() => {}}
                      className="bg-[#0a1128] text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                  >
                    Refresh
                  </button>
                </div>
              </motion.div>
          )}

          {/* Products Grid */}
          {!loading && filteredProducts.length > 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
          )}

          {/* Load More Button */}
          {!loading && filteredProducts.length > 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-12"
              >
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Load More Products
                </button>
              </motion.div>
          )}
        </div>
      </section>
  );
};

export default ProductList;
