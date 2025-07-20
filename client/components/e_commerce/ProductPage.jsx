'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from './contexts/CartContext';

const products = [
  {
    id: 1,
    name: 'Branded hoodies',
    price: 1320,
    image: '/images/hoodie.png',
    images: ['/images/hoodie.png'],
    sizes: ['S', 'M', 'L'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded hoodie for everyday wear'
  },
  {
    id: 2,
    name: 'Branded Cup',
    price: 1320,
    image: '/images/cup.png',
    images: ['/images/cup.png', '/images/cup.png', '/images/cup.png','/images/cup.png'],
    sizes: ['300ml', '500ml', '1L'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded cup for everyday wear'
  },
  {
    id: 3,
    name: 'Branded Notebook',
    price: 1320,
    image: '/images/Notebook.png',
    images: ['/images/Notebook.png','/images/Notebook.png','/images/Notebook.png','/images/Notebook.png'],
    sizes: ['A1', 'A2', 'A4'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded hoodie for everyday wear'
  },
   {
    id: 4,
    name: 'Branded Waterbottle',
    price: 1320,
    image: '/images/waterbottle.png',
    images: ['/images/waterbottle.png','/images/waterbottle.png','/images/waterbottle.png'],
    sizes: ['S', 'M', 'L'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded hoodie for everyday wear'
  },
   {
    id: 5,
    name: 'Branded hoodies',
    price: 1320,
    image: '/images/hoodie.png',
    images: ['/images/hoodie.png'],
    sizes: ['S', 'M', 'L'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded hoodie for everyday wear'
  },
  {
    id: 6,
    name: 'Branded Cup',
    price: 1320,
    image: '/images/cup.png',
    images: ['/images/cup.png', '/images/cup.png', '/images/cup.png','/images/cup.png'],
    sizes: ['300ml', '500ml', '1L'],
    colours: ['#000000', '#FFFFFF'],
    description: 'Cozy branded cup for everyday wear'
  }
];

const ProductPage = () => {
  const { id } = useParams(); 
  const { addToCart } = useCart();
  const router = useRouter();

  const product = products.find(p => p.id == id);

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-7xl border border-gray-200 shadow-lg m-4 rounded-lg mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full max-h-2.5/4 rounded-lg  p-2 "
          />
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx}`}
                className="w-20 h-20 object-cover rounded-lg border flex-shrink-0"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-green-600 font-bold mb-4">KES {product.price}</p>
          <p className="mb-4">{product.description}</p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className="border px-3 py-1 rounded hover:bg-gray-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Colour</h3>
            <div className="flex space-x-2">
              {product.colours.map((color, idx) => (
                <span
                  key={idx}
                  style={{ backgroundColor: color }}
                  className="w-8 h-8 rounded-full border"
                ></span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => {
                addToCart(product);
              }}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 w-full sm:w-auto"
            >
              Add to Cart
            </button>
            <button
              onClick={() => router.push('/e_commerce/checkout')}
              className="border px-6 py-3 rounded hover:bg-gray-100 w-full sm:w-auto"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">OUR PRODUCT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-2 hover:shadow transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold text-sm">{item.name}</h3>
              <p className="text-green-600 text-sm">KES {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
