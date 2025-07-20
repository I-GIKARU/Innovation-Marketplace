'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useMerchandise } from '@/hooks/useMerchandise';

const ProductList = () => {
    const {
        merchandise,
        loading,
        error,
        fetchMerchandise,
    } = useMerchandise();

    useEffect(() => {
        // Avoid dependency loop by calling fetchMerchandise inline
        const load = async () => {
            await fetchMerchandise();
        };
        load();
    }, []); // 👈 empty dependency array ensures this runs only once

    return (
        <section className="px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Shop Products</h2>

            {loading && <p className="text-gray-500">Loading products...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {!loading && merchandise.length === 0 && (
                    <p>No merchandise available.</p>
                )}

                {merchandise.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition"
                    >
                        <img
                            src={product.image_url || '/images/default.png'}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h3 className="mt-2 font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        <p className="text-green-600 font-bold mt-1">KES {product.price}</p>
                        <Link href={`/e_commerce/product/${product.id}`}>
                            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full">
                                Buy Now
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductList;
