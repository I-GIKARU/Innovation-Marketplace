'use client';
import React from 'react'
import ProductPage from "@/components/e_commerce/ProductPage"
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";

const Productpage = () => {
  return (
    <>
        <Navbar />
        <ProductPage />
        <Footer />
    </>
  )
}

export default Productpage