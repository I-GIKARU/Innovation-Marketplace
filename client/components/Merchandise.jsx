'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
    fetchMerchandise({ perPage: 10 }); // still fetch more, just show 3
  }, [fetchMerchandise]);

  useEffect(() => {
    if (merchandise.length > 0) {
      setDisplayItems(merchandise.slice(0, 3));
    }
  }, [merchandise]);

  return (
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Text Content */}
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Merch for Devs, by Devs.
            </h2>
            <p className="text-gray-700 text-lg">
              Hoodies, mugs, stickers, and more — crafted to inspire your daily grind.
            </p>
            <p className="text-gray-500 italic">
              Every purchase supports student innovation and growth.
            </p>
            <Link href="/e_commerce">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105">
                Shop Moringa Merch
              </button>
            </Link>
          </div>

          {/* Merchandise Display */}
          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading && <p className="text-gray-500">Loading merchandise...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && displayItems.length === 0 && (
                <p className="text-gray-500">No merchandise found.</p>
            )}
            {!loading && displayItems.map(item => (
                <div key={item.id} className="overflow-hidden rounded-xl group shadow-md">
                  {item.image_url ? (
                      <img
                          src={item.image_url}
                          alt={item.name || 'Merch item'}
                          className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
                      />
                  ) : (
                      <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                  )}
                </div>
            ))}
          </div>

        </div>
      </section>
  );
};

export default Merchandise;
