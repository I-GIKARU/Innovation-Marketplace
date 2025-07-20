import React from 'react';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Branded hoodies', price: 1320, image: '/images/hoodie.png' },
  { id: 2, name: 'Branded Cup', price: 2850, image: '/images/cup.png' },
  { id: 3, name: 'Branded Notebook', price: 1200, image: '/images/Notebook.png' },
  { id: 4, name: 'Moringa Waterbottle', price: 1200, image:  '/images/waterbottle.png' },
  { id: 5, name: 'Branded hoodies', price: 1320, image: '/images/hoodie.png' },
  { id: 6, name: 'Branded Cup', price: 2850, image: '/images/cup.png' },

];

const ProductList = () => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Shop Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
                <h3 className="mt-2 font-semibold">{product.name}</h3>
                <p className="text-green-600 font-bold">KES {product.price}</p>
                <Link  href={`e_commerce/product/${product.id}`} key={product.id}>
                    <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full">Buy Now</button>
                </Link> 
            </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
