'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useAuthContext } from '@/contexts/AuthContext';

const BuyMeCoffee = ({ project, isOpen, onClose }) => {
  const { user, authFetch } = useAuthContext();
  const isAuthenticated = !!user;
  const [donationAmount, setDonationAmount] = useState('');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setDonationAmount(value);
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseInt(donationAmount);

    if (!amount || amount < 10) {
      newErrors.amount = 'Minimum donation is KES 10';
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus('pending');
    setStatusMessage('Initiating donation payment...');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const amount = parseInt(donationAmount);
      
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: formattedPhone,
          amount: amount,
          account_reference: `COFFEE-${project.id}-${Date.now()}`,
          transaction_desc: `Buy coffee for ${project.title} - KES ${amount}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage('STK push sent! Please check your phone and enter your M-Pesa PIN.');
        pollPaymentStatus(result.checkout_request_id);
      } else {
        setPaymentStatus('failed');
        setStatusMessage(result.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Donation payment error:', error);
      setPaymentStatus('failed');
      setStatusMessage('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (requestId) => {
    let attempts = 0;
    const maxAttempts = 10; // Reduced for donations
    
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/mpesa/payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkout_request_id: requestId,
          }),
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          const { ResultCode, ResultDesc } = result.data;
          
          if (ResultCode === 0) {
            setPaymentStatus('success');
            setStatusMessage('Thank you for your donation! ☕ Your support means a lot!');
            return;
          } else if (ResultCode === 1032) {
            setPaymentStatus('failed');
            setStatusMessage('Payment cancelled by user.');
            return;
          } else if (ResultCode !== undefined && ResultCode !== 0) {
            setPaymentStatus('failed');
            setStatusMessage(ResultDesc || 'Payment failed');
            return;
          }
        } else if (!result.success) {
          console.warn('M-Pesa donation status check failed:', result.message);
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          // Longer intervals for donations
          const delay = Math.min(12000 + (attempts * 3000), 20000); // 12-20 seconds
          setTimeout(checkStatus, delay);
        } else {
          // Assume success for donations
          setPaymentStatus('success');
          setStatusMessage('Thank you for your donation! ☕ If you completed the payment, it will be processed shortly.');
        }
      } catch (error) {
        console.error('Status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 20000); // Even longer after errors
        } else {
          setPaymentStatus('success');
          setStatusMessage('Thank you for your donation! ☕');
        }
      }
    };

    // Wait a bit longer before starting to check
    setTimeout(checkStatus, 8000);
  };

  const resetForm = () => {
    setDonationAmount('');
    setPhoneNumber('');
    setPaymentStatus(null);
    setStatusMessage('');
    setErrors({});
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-200 rounded-xl shadow-xl w-full max-w-sm max-h-[70vh] overflow-y-auto"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 20%, #f59e0b 40%, #d97706 60%, #b45309 80%, #92400e 100%)',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1)'
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">☕</span>
                <div>
                  <h3 className="text-xl font-bold text-white">Buy Me Coffee</h3>
                  <p className="text-sm text-white/80">Support {project.title}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {paymentStatus ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                {paymentStatus === 'pending' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Processing Donation
                      </h4>
                      <p className="text-gray-600">{statusMessage}</p>
                    </div>
                  </div>
                )}

                {paymentStatus === 'success' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-green-900 mb-2">
                        Donation Successful!
                      </h4>
                      <p className="text-green-600">{statusMessage}</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}

                {paymentStatus === 'failed' && (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-900 mb-2">
                        Donation Failed
                      </h4>
                      <p className="text-red-600">{statusMessage}</p>
                    </div>
                    <button
                      onClick={() => setPaymentStatus(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Amount (KES) *
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter donation amount (minimum KES 10)"
                    min="10"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                      errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    M-Pesa Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="0700000000 or +254700000000"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>


                {/* Total Display */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Donation Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      KES {donationAmount ? parseInt(donationAmount).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={isProcessing || !donationAmount || parseInt(donationAmount) < 10 || !phoneNumber.trim()}
                  className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:from-yellow-500 hover:via-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      Buy Coffee - KES {donationAmount ? parseInt(donationAmount).toLocaleString() : '0'}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your donation helps support the development and maintenance of this project. Thank you! ☕
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BuyMeCoffee;
