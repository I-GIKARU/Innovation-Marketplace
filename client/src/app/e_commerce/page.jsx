
import React from 'react';
import Navbar from "@/components/e_commerce/Navbar";
import Hero from "@/components/e_commerce/Hero"
import ProductList from "@/components/e_commerce/ProductList"
import {CartProvider} from "@/components/e_commerce/contexts/CartContext"
import Footer from "@/components/Footer";

const MerchandisePage = () => {
    return (
        <CartProvider>
            <main>
                <Navbar />
                <Hero />
                <ProductList />
                <Footer />
            </main>
        </CartProvider>
    );
};

export default MerchandisePage;
