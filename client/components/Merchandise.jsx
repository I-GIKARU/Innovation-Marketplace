'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';
import { ShoppingBagIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Merchandise = () => {
  const { merchandise, fetchMerchandise, loading, error } = useMerchandise();
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    fetchMerchandise({ perPage: 10 });
  }, [fetchMerchandise]);

  useEffect(() => {
    if (merchandise.length > 0) {
      const parsedItems = merchandise.map(item => {
        let imageUrl = '/placeholder-image.jpg'; // fallback image

        try {
          if (item.image_urls) {
            const parsedUrls = JSON.parse(item.image_urls);
            if (parsedUrls && parsedUrls.length > 0) {
              imageUrl = parsedUrls[0];
            }
          } else if (item.image_url) {
            imageUrl = item.image_url;
          }
        } catch (error) {
          console.warn('Failed to parse image URLs for item:', item.name, error);
          if (item.image_url) {
            imageUrl = item.image_url;
          }
        }

        return {
          ...item,
          image: imageUrl,
        };
      });
      setDisplayItems(parsedItems.slice(0, 4));
    }
  }, [merchandise]);


  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        Error loading merchandise.
      </p>
    );

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#0a1128] relative overflow-hidden">
      {/* Background decorative elements removed for simplicity */}
      <div className="relative z-10">
        {/* Header */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <p className="text-white text-2xl">Loading...</p>
          </div>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-full mb-4 sm:mb-6">
            <ShoppingBagIcon className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 font-medium text-sm">Official Store</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 via-orange-800 to-gray-900 bg-clip-text text-transparent mb-3 px-4">
            Premium Merch
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Elevate your style with our exclusive collection. Quality meets innovation.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-orange-600">KES {item.price}</span>
                    <span className="text-sm text-gray-400 line-through">KES {Math.round(item.price * 1.3)}</span>
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    In Stock
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link 
                    href={`/merchandise/${item.id}`}
                    className="flex-1 group/btn"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingBagIcon className="w-4 h-4" />
                      <span>View Product</span>
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-orange-200/0 group-hover:border-orange-200/50 transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/e_commerce">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 relative overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <span className="relative flex items-center gap-3">
                <ShoppingBagIcon className="w-5 h-5" />
                Explore Full Collection
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Merchandise;
