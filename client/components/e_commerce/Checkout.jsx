'use client';

import React from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

const CheckoutPage = () => {
  const { cart } = useCart();
  
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 350 : 0;
  const total = subtotal + shipping;
  
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-4">Add some items to your cart before checking out.</p>
        <Link href="/e_commerce" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      
      <div className="md:col-span-2 space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          <p className="text-gray-600">Complete your order details below.</p>
          
          {/* Delivery Address Form */}
          <div className="mt-6 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
            <p className="text-sm text-gray-500">Enter your delivery details here.</p>
            {/* Form fields can be added here */}
          </div>
          
          {/* Payment Method */}
          <div className="mt-6 p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <p className="text-sm text-gray-500">Select your preferred payment method.</p>
            {/* Payment options can be added here */}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between border-b pb-2">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t mt-4 pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>KES {shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>
        </div>
        
        <button className="w-full bg-green-600 text-white py-3 rounded mt-4 hover:bg-green-700">
          Place Order
        </button>
        
        <Link href="/e_commerce/cart" className="block text-center text-blue-600 mt-2 hover:underline">
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default CheckoutPage;
