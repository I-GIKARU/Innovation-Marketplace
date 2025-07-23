'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';

const Merchandise = () => {
  const { merchandise, fetchMerchandise, loading, error } = useMerchandise();
  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    fetchMerchandise({ perPage: 10 });
  }, [fetchMerchandise]);

  useEffect(() => {
    if (merchandise.length > 0) {
      const parsedItems = merchandise.map(item => ({
        ...item,
        image: JSON.parse(item.image_urls)[0], // first image
      }));
      setDisplayItems(parsedItems.slice(0, 4));
    }
  }, [merchandise]);

  if (loading)
    return <p className="text-center py-10">Loading merchandise...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        Error loading merchandise.
      </p>
    );

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        Official Merch
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Wear your journey. Support the community. Rep the code.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
        {displayItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, opacity: 0.95 }}
            className="group relative rounded-2xl overflow-hidden shadow-sm border border-gray-200"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />

            {/* Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 z-20">
              <h3 className="text-white text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-300 mb-3">KES {item.price}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black text-sm px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 z-10"
              >
                Buy Now
              </a>
            </div>
          </motion.div>
         
        ))}
      </div>
      <div className="text-center mt-12">
        <a
          href="/e_commerce"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-300"
        >
          View All Merchandise
        </a>
      </div>
    </section>
  );
};

export default Merchandise;
