'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useMerchandise } from '@/hooks/useMerchandise';

const ProductPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const { fetchMerchandiseById, loading, singleItem: product } = useMerchandise();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMerchandiseById(id);
    }
  }, [id]);

  if (loading || !product)
    return <p className="p-10 text-center text-gray-500">Loading...</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl shadow">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex space-x-2 overflow-x-auto">
            {[product.image_url].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt=""
                className="w-20 h-20 object-cover rounded-lg border hover:opacity-80 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {product.name}
          </h1>

          <p className="text-xl text-[#00B386] font-semibold mb-6">
            KES {product.price}
          </p>

          <p className="text-gray-700 mb-8">{product.description}</p>

          {/* Size selector */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Select Size</h3>
            <div className="flex space-x-3">
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedSize === size
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Select Colour</h3>
            <div className="flex space-x-3">
              {['#000000', '#FFFFFF'].map((color, idx) => (
                <span
                  key={idx}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border cursor-pointer ${
                    selectedColor === color ? 'ring-2 ring-gray-800' : ''
                  }`}
                ></span>
              ))}
            </div>
          </div>

          <button
            onClick={async () => {
              if (!selectedSize || !selectedColor) {
                alert('Please select a size and color');
                return;
              }

              setAddingToCart(true);
              try {
                addToCart({
                  ...product,
                  id: product._id || product.id,
                  selectedSize,
                  selectedColor,
                });
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000);
              } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Failed to add item to cart');
              } finally {
                setAddingToCart(false);
              }
            }}
            disabled={addingToCart}
            className={`w-full py-4 rounded-full font-medium text-lg transition ${
              addedToCart
                ? 'bg-[#00B386] text-white'
                : 'bg-black text-white hover:bg-gray-800'
            } ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {addingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
