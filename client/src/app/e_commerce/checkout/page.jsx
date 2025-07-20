'use client'

import React from 'react'
import CheckoutPage from '@/components/e_commerce/Checkout'
import {CartProvider} from "@/components/e_commerce/contexts/CartContext"
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";

const Checkout = () => {
  return (
    <CartProvider>
        <Navbar />
        <CheckoutPage />
        <Footer />
    </CartProvider>
  );
};

export default Checkout