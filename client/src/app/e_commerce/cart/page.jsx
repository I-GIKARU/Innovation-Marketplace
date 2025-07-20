'use client'

import React from 'react'
import CartPage from '@/components/e_commerce/Cart'
import {CartProvider} from "@/components/e_commerce/contexts/CartContext"
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  return (
    <CartProvider>
        <Navbar />
        <CartPage />
        <Footer />
    </CartProvider>
  );
};

export default Cart