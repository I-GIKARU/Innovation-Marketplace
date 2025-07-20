import React from 'react';
import Link from 'next/link';

const products = [
  {
    id: 1,
    image: '/images/hoodie.png',
    alt: 'Hoodie',
  },
  {
    id: 2,
    image: '/images/cup.png',
    alt: 'Mug',
  },
  {
    id: 3,
    image: '/images/Notebook.png',
    alt: 'Notebook',
  },
  {
    id: 4,
    image: '/images/waterbottle.png',
    alt: 'Bottle',
  },
];

const Merchandise = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        
        
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

      
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          {products.map(product => (
            <div key={product.id} className="overflow-hidden rounded-xl group">
              <img
                src={product.image}
                alt={product.alt}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Merchandise;
