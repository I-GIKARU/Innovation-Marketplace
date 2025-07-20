// /contexts/CartContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // Load cart from localStorage on component mount
    useEffect(() => {
        setIsClient(true);
        const savedCart = localStorage.getItem('marketplace-cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
                console.log('Loaded cart from localStorage:', parsedCart);
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever cart changes
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('marketplace-cart', JSON.stringify(cart));
            console.log('Saved cart to localStorage:', cart);
        }
    }, [cart, isClient]);

    const addToCart = (product) => {
        console.log('Adding to cart:', product); // Debug log
        
        // Ensure consistent ID field
        const productId = product.id || product._id;
        const productToAdd = { ...product, id: productId };
        
        setCart(prev => {
            console.log('Current cart:', prev); // Debug log
            
            const match = prev.find(
                item =>
                    item.id === productId &&
                    item.selectedSize === product.selectedSize &&
                    item.selectedColor === product.selectedColor
            );

            let newCart;
            if (match) {
                newCart = prev.map(item =>
                    item.id === productId &&
                    item.selectedSize === product.selectedSize &&
                    item.selectedColor === product.selectedColor
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newCart = [...prev, { ...productToAdd, quantity: 1 }];
            }
            
            console.log('New cart:', newCart); // Debug log
            return newCart;
        });
    };

    const removeFromCart = (product) => {
        setCart(prev =>
            prev.filter(
                item =>
                    !(
                        item.id === product.id &&
                        item.selectedSize === product.selectedSize &&
                        item.selectedColor === product.selectedColor
                    )
            )
        );
    };

    const updateQuantity = (product, quantity) => {
        if (quantity < 1) return;
        setCart(prev =>
            prev.map(item =>
                item.id === product.id &&
                item.selectedSize === product.selectedSize &&
                item.selectedColor === product.selectedColor
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
