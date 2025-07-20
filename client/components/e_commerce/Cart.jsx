'use client';

import Link from 'next/link';
import {useCart} from "@/contexts/CartContext";

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return <p className="p-6 text-gray-600">Your cart is empty.</p>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
            {cart.map(item => (
                <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center justify-between border-b py-4"
                >
                    <div className="flex items-center gap-4">
                        <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded" />
                        <div>
                            <h2 className="font-semibold">{item.name}</h2>
                            <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                            <p className="text-sm text-gray-600">Color: <span className="inline-block w-4 h-4 rounded-full border" style={{ backgroundColor: item.selectedColor }} /></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                        <button
                            className="text-red-500 ml-2"
                            onClick={() => removeFromCart(item)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className="mt-6 text-right">
                <p className="text-lg font-bold mb-2">Total: KES {total}</p>
                <Link href="/e_commerce/checkout">
                    <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                        Proceed to Checkout
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CartPage;
