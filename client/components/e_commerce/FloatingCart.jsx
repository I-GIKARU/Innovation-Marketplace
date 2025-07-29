'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import MpesaPayment from './MpesaPayment';

const FloatingCart = ({  }) => {
  const { cart, updateQuantity, removeFromCartById, getCartTotal, getCartCount, clearCart } = useCart();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mode, setMode] = useState('cart'); // 'cart' or 'checkout'
  
  // Checkout form state
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation (required)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    console.log('Form submission - formData before validation:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    console.log('Validation passed, proceeding with order');
    setIsLoading(true);
    setErrors({});

    try {
      // Prepare order data for new /api/buy endpoint
      const orderData = {
        email: formData.email,
        items: cart.map(item => ({
          merchandise_id: item.id,
          quantity: item.quantity
        }))
      };

      console.log('Order data being sent:', orderData);

      // Make API request to new endpoint
      const response = await fetch('/api/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error) {
          setErrors({ general: result.error });
        } else {
          setErrors({ general: 'Failed to place order. Please try again.' });
        }
        return;
      }

      // Success
      setOrderSuccess(true);
      clearCart();
      
      // Reset form
      setFormData({
        email: ''
      });
      
      // Auto close after success
      setTimeout(() => {
        setOrderSuccess(false);
        setMode('cart');
        setIsOpen(false);
      }, 3000);

    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToCheckout = () => {
    setMode('checkout');
    // Pre-fill user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  };

  const switchToCart = () => {
    setMode('cart');
    setErrors({});
    setOrderSuccess(false);
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const cartCount = cart?.length ? getCartCount() : 0;
  const cartTotal = cart?.length ? getCartTotal() : 0;

  return (
    <>
      {/* Floating Cart Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isVisible ? 1 : 0.8, 
          opacity: isVisible ? 1 : 0.5,
          y: isVisible ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-[#0a1128] hover:bg-orange-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          
          {/* Cart Count Badge */}
          {cartCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg"
            >
              {cartCount > 99 ? '99+' : cartCount}
            </motion.div>
          )}

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
        </button>
      </motion.div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3">
                  {mode === 'checkout' && (
                    <button
                      onClick={switchToCart}
                      className="p-2 hover:bg-white/50 rounded-full transition-colors"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {mode === 'cart' ? `Shopping Cart (${cartCount})` : 'Checkout'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content based on mode */}
              <div className="flex-1 overflow-y-auto">
                {mode === 'cart' ? (
                  // Cart Mode
                  <div className="p-6">
                    {cart?.length === 0 || !cart ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShoppingCartIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Add some products to get started!</p>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="bg-[#0a1128] hover:bg-orange-500 text-white px-6 py-3 rounded-full transition-all duration-300 font-semibold"
                        >
                          Continue Shopping
                        </button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                              <img
                                src={item.image_url || '/images/default.png'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                              <p className="text-sm text-gray-500">KES {item.price?.toLocaleString()}</p>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                  className="p-1 hover:bg-white rounded-full transition-colors"
                                >
                                  <MinusIcon className="w-4 h-4 text-gray-500" />
                                </button>
                                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-white rounded-full transition-colors"
                                >
                                  <PlusIcon className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCartById(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Checkout Mode
                  <div className="p-6">
                    {orderSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                      >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircleIcon className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
                        <p className="text-gray-600 mb-4">Thank you for your order. You will receive a confirmation email shortly.</p>
                        <p className="text-sm text-gray-500">This window will close automatically...</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
                          <div className="space-y-2">
                            {cart.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>KES {cartTotal?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* General Error */}
                        {errors.general && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                            {errors.general}
                          </div>
                        )}

{/* Customer Information */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            Customer Information
                          </h3>
                          
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <div className="relative">
                              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="your@email.com"
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                          </div>

                          {/* M-Pesa Payment */}
                          <MpesaPayment 
                            amount={cartTotal}
                            orderData={{
                              email: formData.email,
                              items: cart.map(item => ({
                                merchandise_id: item.id,
                                quantity: item.quantity
                              }))
                            }} 
                            onPaymentSuccess={(paymentData) => {
                              setOrderSuccess(true);
                              clearCart();
                              setTimeout(() => {
                                setOrderSuccess(false);
                                setMode('cart');
                                setIsOpen(false);
                              }, 3000);
                            }}
                            onPaymentError={(errorMessage) => {
                              setErrors({ general: errorMessage || 'Failed to complete payment. Please try again.' });
                            }}
                          />

                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer for Cart Mode */}
              {mode === 'cart' && cart?.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-white">
                  {/* Total */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      KES {cartTotal?.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={switchToCheckout}
                      className="w-full bg-[#0a1128] hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Proceed to Checkout
                    </button>
                    

                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
