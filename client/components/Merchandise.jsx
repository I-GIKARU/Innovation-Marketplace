'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';

const Merchandise = () => {
  const {
    merchandise,
    fetchMerchandise,
    loading,
    error
  } = useMerchandise();

  const [displayItems, setDisplayItems] = useState([]);

  useEffect(() => {
    fetchMerchandise({ perPage: 10 });
  }, [fetchMerchandise]);

    useEffect(() => {
        if (merchandise.length > 0) {
            const parsedItems = merchandise.map(item => ({
                ...item,
                image: JSON.parse(item.image_urls)[0], // use first image
            }));
            setDisplayItems(parsedItems.slice(0, 3));
        }
    }, [merchandise]);


    if (loading) return <p className="text-center py-10">Loading merchandise...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error loading merchandise.</p>;

  return (
      <section className="py-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Official Merch</h2>
        <p className="text-center text-gray-600 mb-12">
          Wear your journey. Support the community. Rep the code.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
          {displayItems.map((item, index) => (
              <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg group"
              >
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300 z-10" />
                <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-white bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-white/80 mb-2">{item.price}</p>
                  <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-white text-black text-sm px-4 py-2 rounded hover:bg-yellow-400 transition"
                  >
                    Buy Now
                  </a>
                </div>
              </motion.div>
          ))}
        </div>
      </section>
  );
};

export default Merchandise;
