'use client';

import {createContext, useState, useContext} from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) =>{
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if(exists){
                return prev.map(item =>
                item.id === product.id ? {...item, quantity:item.quantity+1}: item
                );
            } else {
                return [...prev, {...product, quantity:1}];
            }
        });
    };
    const removeFromCart = (id) =>{
        setCart(prev => prev.filter(item => item.id !== id))
    };

    const updateQuantity = (id, quantity) =>{
        setCart(prev => prev.map(item => item.id === id ? {...item, quantity}: item));
    };

    return (
        <CartContext.Provider value={{cart,addToCart,removeFromCart,updateQuantity}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext)