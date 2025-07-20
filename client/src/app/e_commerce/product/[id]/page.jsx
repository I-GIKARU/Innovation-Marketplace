import React from 'react'
import ProductPage from "@/components/e_commerce/ProductPage"
import Navbar from "@/components/e_commerce/Navbar";
import Footer from "@/components/Footer";
import {CartProvider} from "@/components/e_commerce/contexts/CartContext"

const Productpage = () => {
  return (
    <CartProvider>
        <Navbar />
        <ProductPage />
        <Footer />
    </CartProvider>
  )
}

export default Productpage