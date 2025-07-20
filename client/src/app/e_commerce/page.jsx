
import React from 'react';
import Navbar from "@/components/e_commerce/Navbar";
import Hero from "@/components/e_commerce/Hero"
import ProductList from "@/components/e_commerce/ProductList"
import Footer from "@/components/Footer";

const MerchandisePage = () => {
    return (
        <main>
            <Navbar />
            <Hero />
            <ProductList />
            <Footer />
        </main>
    );
};

export default MerchandisePage;
