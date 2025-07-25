'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import {CheckIcon} from "lucide-react";

const AddToCartModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setIsAdded(false);
      setIsLoading(false);
    }
  }, [isOpen, product]);

  if (!product) return null;

  // Check if product is in stock
  const isInStock = (product.quantity || 0) > 0;
  const maxQuantity = Math.min(product.quantity || 0, 10); // Limit to 10 or available stock

  const handleAddToCart = async () => {
    if (!isInStock || quantity > maxQuantity) {
      return;
    }

    setIsLoading(true);
    
    try {
      await addToCart({
        ...product,
        quantity
      });
      
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, maxQuantity));
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));


  const modalVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 500
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">Add to Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

            {/* Content */}
            <div className="p-6">
              {/* Product Image & Info */}
              <div className="mb-8">
                <div className="relative mb-4">
                  <img
                    src={product.image_url || JSON.parse(product.image_urls || '[]')[0] || '/images/default.png'}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Stock Status */}
                <div className="mb-4">
                  {isInStock ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        {product.quantity > 10 ? 'In Stock' : 
                         product.quantity > 5 ? `Only ${product.quantity} left!` : 
                         `Last ${product.quantity} items!`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    KES {product.price?.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    KES {Math.round(product.price * 1.25)?.toLocaleString()}
                  </span>
                </div>
              </div>


              {/* Quantity */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h4>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <MinusIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= maxQuantity}
                    className={`p-2 rounded-full border transition-colors ${
                      quantity >= maxQuantity 
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                  {isInStock && (
                    <span className="text-xs text-gray-500 ml-2">
                      {product.quantity} available
                    </span>
                  )}
                </div>
              </div>

              {/* Error Messages */}
              {!isInStock && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    This item is currently out of stock.
                  </p>
                </div>
              )}
              
              {quantity > maxQuantity && (
                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-700">
                    Only {maxQuantity} items available in stock.
                  </p>
                </div>
              )}

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    KES {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || isLoading || isAdded || quantity > maxQuantity}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-green-500 hover:bg-green-600'
                    : (!isInStock || isLoading || quantity > maxQuantity)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0a1128] hover:bg-orange-500 transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : isAdded ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBagIcon className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddToCartModal;
