'use client';

import { useCart } from './contexts/CartContext';
import Link from 'next/link';

const CartPage = () => {
  const { cart, addToCart,removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cart.map(item => (
        <div key={item.id} className="flex items-center mb-4 border-b pb-2">
          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
          <div className="flex-1 ml-4">
            <h3>{item.name}</h3>
            <div className="flex items-center space-x-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
          </div>
          <p>KES {item.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2">Remove</button>
        </div>
      ))}

      <div className="mt-4">
        <p className="text-lg font-bold">Total: KES {total}</p>
        <Link href="/e_commerce/checkout">
          <button className="mt-2 w-full bg-green-600 text-white py-2 rounded">Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
