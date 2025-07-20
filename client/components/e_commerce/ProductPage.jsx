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

    if (loading || !product) return <p className="p-8">Loading...</p>;

    return (
        <div className="max-w-7xl border border-gray-200 shadow-lg m-4 rounded-lg mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full max-h-96 rounded-lg p-2"
                    />
                    {/* Placeholder if you eventually add more images */}
                    <div className="flex space-x-2 overflow-x-auto mt-2">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                        />
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-green-600 font-bold mb-4">KES {product.price}</p>
                    <p className="mb-4">{product.description}</p>

                    {/* Size selector (placeholder) */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {['S', 'M', 'L'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`border px-3 py-1 rounded hover:bg-gray-200 ${
                                        selectedSize === size ? 'bg-gray-300' : ''
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color selector (placeholder) */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Colour</h3>
                        <div className="flex space-x-2">
                            {['#000000', '#FFFFFF'].map((color, idx) => (
                                <span
                                    key={idx}
                                    onClick={() => setSelectedColor(color)}
                                    style={{ backgroundColor: color }}
                                    className={`w-8 h-8 rounded-full border cursor-pointer ${
                                        selectedColor === color ? 'ring-2 ring-black' : ''
                                    }`}
                                ></span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            onClick={async () => {
                                if (!selectedSize || !selectedColor) {
                                    alert('Please select a size and color');
                                    return;
                                }
                                
                                setAddingToCart(true);
                                console.log('Product before adding to cart:', product);
                                console.log('Selected size:', selectedSize);
                                console.log('Selected color:', selectedColor);
                                
                                try {
                                    addToCart({
                                        ...product,
                                        id: product._id || product.id, // ensure consistent ID
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
                            className={`px-6 py-3 rounded w-full transition-colors ${
                                addedToCart 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-black text-white hover:bg-gray-800'
                            } ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {addingToCart ? 'Adding...' : addedToCart ? '✓ Added!' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
