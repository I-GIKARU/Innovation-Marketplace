'use client'

import React from 'react'
import CheckoutPage from '@/components/e_commerce/Checkout'
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";

const Checkout = () => {
  return (
    <>
        <Navbar />
        <CheckoutPage />
        <Footer />
    </>
  );
};

export default Checkout