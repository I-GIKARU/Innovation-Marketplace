'use client';
import React, { Suspense, lazy, useState } from 'react';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/e_commerce/FloatingCart";
import AddToCartModal from "@/components/e_commerce/AddToCartModal";

// Lazy load components for better performance
const Hero = lazy(() => import("@/components/e_commerce/Hero"));
const ProductList = lazy(() => import("@/components/e_commerce/ProductList"));
const OrderManagement = lazy(() => import("@/components/e_commerce/OrderManagement"));

// Loading placeholder component
const LoadingPlaceholder = ({ height = "h-64" }) => (
    <div className={`${height} bg-gray-100 animate-pulse rounded-lg flex items-center justify-center`}>
        <div className="text-gray-500">Loading...</div>
    </div>
);

const MerchandisePage = () => {
    const [currentView, setCurrentView] = useState('home'); // 'home', 'orders'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);

    // Navigation handlers
    const showHome = () => setCurrentView('home');
    const showOrders = () => setCurrentView('orders');
    const openAddToCartModal = (product) => {
        setSelectedProduct(product);
        setIsAddToCartModalOpen(true);
    };
    const closeAddToCartModal = () => {
        setIsAddToCartModalOpen(false);
        setSelectedProduct(null);
    };

    const renderContent = () => {
        switch (currentView) {
            case 'orders':
                return (
                    <Suspense fallback={<LoadingPlaceholder height="h-screen" />}>
                        <OrderManagement onNavigate={{ showHome }} />
                    </Suspense>
                );
            default:
                return (
                    <>
                        {/* Hero Section */}
                        <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
                            <Hero onProductClick={openAddToCartModal} />
                        </Suspense>
                        
                        {/* Product List */}
                        <Suspense fallback={<LoadingPlaceholder height="h-screen" />}>
                            <ProductList onProductClick={openAddToCartModal} />
                        </Suspense>
                    </>
                );
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Global Navigation Bar */}
            <NavBar />
            
            {/* Dynamic Content */}
            {renderContent()}
            
            {/* Floating Cart - only show on home view */}
            {currentView === 'home' && <FloatingCart onOrdersClick={showOrders} />}
            
            {/* Add to Cart Modal */}
            <AddToCartModal 
                isOpen={isAddToCartModalOpen}
                onClose={closeAddToCartModal}
                product={selectedProduct}
            />
            
            {/* Footer */}
            <Footer />
        </main>
    );
};

export default MerchandisePage;
