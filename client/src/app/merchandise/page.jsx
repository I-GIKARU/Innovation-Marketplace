// merchandise/page.jsx
import React from 'react';
import Merchandise from "@/components/Merchandise";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const MerchandisePage = () => {
    return (
        <main>
            <NavBar />
            <Merchandise />
            <Footer />
        </main>
    );
};

export default MerchandisePage;
