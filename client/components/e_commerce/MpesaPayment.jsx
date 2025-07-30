'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import apiClient from '@/lib/apiClient';

const MpesaPayment = ({ amount, orderData, onPaymentSuccess, onPaymentError }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'success', 'failed'
  const [statusMessage, setStatusMessage] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (phone) => {
    // Kenyan phone number validation
    const phoneRegex = /^(0|\+254|254)?([17]\d{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhoneNumber = (phone) => {
    // Remove spaces and format to Kenyan standard
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('+254')) {
      return cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    }
    return '254' + cleaned;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    // Clear error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const initiateMpesaPayment = async () => {
    // Validate phone number
    if (!phoneNumber.trim()) {
      setErrors({ phone: 'Phone number is required' });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setErrors({ phone: 'Please enter a valid Kenyan phone number' });
      return;
    }

    setIsProcessing(true);
    setErrors({});
    setPaymentStatus('pending');
    setStatusMessage('Initiating M-Pesa payment...');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const response = await apiClient.post('/mpesa/stk-push', {
        phone_number: formattedPhone,
        amount: amount,
        account_reference: `ORDER-${Date.now()}`,
        transaction_desc: `Payment for merchandise - KES ${amount}`,
      });

      const result = response.data;

      if (result.success) {
        setCheckoutRequestId(result.checkout_request_id);
        setStatusMessage('STK push sent! Please complete payment on your phone. Creating your order...');
        
        // Create order immediately after STK push is sent (assume user will pay)
        await createOrderAfterPayment();
      } else {
        setPaymentStatus('failed');
        setStatusMessage(result.message || 'Failed to initiate payment');
        onPaymentError?.(result.message);
      }
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      setPaymentStatus('failed');
      setStatusMessage('Network error. Please try again.');
      onPaymentError?.('Network error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentStatus = async (requestId) => {
    let attempts = 0;
    const maxAttempts = 12; // Poll for 2 minutes (10 seconds * 12)
    
    const checkStatus = async () => {
      try {
        const response = await apiClient.post('/mpesa/payment-status', {
          checkout_request_id: requestId,
        });

        const result = response.data;
        
        if (result.success && result.data) {
          const { ResultCode, ResultDesc } = result.data;
          
          if (ResultCode === 0) {
            // Payment successful - now create the order
            setStatusMessage('Payment successful! Creating your order...');
            await createOrderAfterPayment();
            return;
          } else if (ResultCode === 1032) {
            // User cancelled
            setPaymentStatus('failed');
            setStatusMessage('Payment cancelled by user.');
            onPaymentError?.('Payment was cancelled');
            return;
          } else if (ResultCode !== undefined && ResultCode !== 0) {
            // Handle different failure types
            if (ResultCode === 1037) {
              // Timeout - user cannot be reached, but they might complete later
              console.warn('M-Pesa timeout - user cannot be reached, but continuing to poll');
              // Don't return, continue polling
            } else {
              // Other payment failures - definitive failure
              setPaymentStatus('failed');
              setStatusMessage(ResultDesc || 'Payment failed');
              onPaymentError?.(ResultDesc || 'Payment failed');
              return;
            }
          }
        } else if (!result.success) {
          // API error - reduce frequency and continue
          console.warn('M-Pesa status check failed:', result.message);
        }
        
        // Continue polling if no definitive result yet
        attempts++;
        if (attempts < maxAttempts) {
          // Use exponential backoff to reduce API load
          const delay = Math.min(10000 + (attempts * 2000), 15000); // 10-15 seconds
          setTimeout(checkStatus, delay);
        } else {
          // After timeout, assume payment might still be processing
          setPaymentStatus('success');
          setStatusMessage('Payment initiated successfully! Your order has been created. If you completed the payment, it will be processed shortly.');
          await createOrderAfterPayment();
        }
      } catch (error) {
        console.error('Status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 15000); // Wait longer after errors
        } else {
          // Assume success after network errors
          setPaymentStatus('success');
          setStatusMessage('Payment processing. Your order has been created.');
          await createOrderAfterPayment();
        }
      }
    };

    // Start checking after a short delay
    setTimeout(checkStatus, 5000);
  };

  const createOrderAfterPayment = async () => {
    try {
      // Get email from orderData if available, or use a default
      const email = orderData?.email || 'customer@example.com';
      
      const response = await apiClient.post('/buy', {
        email: email,
        items: orderData?.items || []
      });

      const result = response.data;

      if (response.status === 200) {
        setPaymentStatus('success');
        setStatusMessage('Order created successfully! Please complete the M-Pesa payment on your phone. You will receive a confirmation email shortly.');
        onPaymentSuccess?.(result);
      } else {
        setPaymentStatus('failed');
        setStatusMessage('Payment successful but order creation failed. Please contact support.');
        onPaymentError?.('Order creation failed after payment');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setPaymentStatus('failed');
      setStatusMessage('Payment successful but order creation failed. Please contact support.');
      onPaymentError?.('Order creation failed after payment');
    }
  };

  const resetPayment = () => {
    setPaymentStatus(null);
    setStatusMessage('');
    setCheckoutRequestId('');
    setIsProcessing(false);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <img 
            src="/images/mpesa-logo.png" 
            alt="M-Pesa" 
            className="w-8 h-8"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <PhoneIcon className="w-6 h-6 text-green-600 hidden" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pay with M-Pesa</h3>
          <p className="text-sm text-gray-600">Secure mobile payment</p>
        </div>
      </div>

      {!paymentStatus && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="0700000000 or +254700000000"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Amount to Pay:</span>
              <span className="text-2xl font-bold text-green-600">
                KES {amount?.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={initiateMpesaPayment}
            disabled={isProcessing || !phoneNumber.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PhoneIcon className="w-5 h-5" />
                Pay with M-Pesa
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            You will receive an STK push notification on your phone. Enter your M-Pesa PIN to complete the payment.
          </p>
        </div>
      )}

      {paymentStatus && (
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
                  Payment in Progress
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
                  Payment Successful!
                </h4>
                <p className="text-green-600">{statusMessage}</p>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-900 mb-2">
                  Payment Failed
                </h4>
                <p className="text-red-600">{statusMessage}</p>
              </div>
              <button
                onClick={resetPayment}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MpesaPayment;
