'use client'

import React from 'react'
import CartPage from '@/components/e_commerce/Cart'
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
    return (
        <>
            <Navbar />
            <CartPage />
            <Footer />
        </>
    );
};

export default Cart
