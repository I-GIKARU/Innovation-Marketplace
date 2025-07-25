"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "@/components/auth/Auth";
import { useEffect } from "react";

export default function AuthPage() {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Handle ESC key press
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
                onClick={handleBackdropClick}
            >
                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-2 h-2 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full opacity-30 animate-bounce"></div>
                    <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-orange-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
                    <div className="absolute top-1/3 right-10 w-1 h-1 bg-orange-600 rounded-full opacity-15 animate-pulse" style={{animationDelay: '3s'}}></div>
                    <div className="absolute bottom-1/3 left-20 w-2 h-2 bg-orange-400 rounded-full opacity-10 animate-bounce" style={{animationDelay: '4s'}}></div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 30 }}
                    transition={{ duration: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                    className="w-full max-w-lg relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Auth onClose={handleClose} />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
