import React from "react";
import Contact from "@/components/Contact";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ContactPage = () => {
    return (
        <main>
            <NavBar />
            <Contact /> {/* This is the imported component */}
            <Footer />
        </main>
    );
};

export default ContactPage;
