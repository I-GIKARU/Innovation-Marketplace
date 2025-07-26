// projects/page.jsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Projects from "@/components/projects/Projects";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Auth from "@/components/auth/Auth";

const ProjectsPage = () => {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <main>
            <NavBar onShowAuth={() => setShowAuth(true)} />
            <Projects />
            <Footer />
            
            {/* Auth Overlay */}
            <AnimatePresence>
                {showAuth && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={() => setShowAuth(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                        
                        {/* Auth Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative z-10 w-full max-w-md mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Auth onClose={() => setShowAuth(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default ProjectsPage;
