'use client';

import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-hot-toast';

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

  // Check authentication when component opens
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
  }, [isOpen, isAuthenticated]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setDonationAmount(value);
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseFloat(donationAmount);

    if (!amount || amount < 100) {
      newErrors.amount = 'Minimum donation is KSH 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus('pending');
    setStatusMessage('Processing your donation...');

    try {
      const amount = parseFloat(donationAmount);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // First, we need to ensure user has expressed interest in the project
      // Get or create user-project relationship
      let userProjectId = null;
      
      try {
        // Try to find existing user-project relationship
        const existingInteractions = await authFetch(`/user-projects`);
        // This will fail if endpoint doesn't support GET, so we'll create contribution directly
      } catch (error) {
        console.log('Could not fetch existing interactions, will create new one if needed');
      }

      // For now, let's create a user-project relationship if it doesn't exist
      // We'll pass the project_id to the contribution endpoint and let backend handle it
      
      // Create the contribution
      const contributionData = {
        project_id: project.id,
        amount: amount,
        comment: comment || `Donation of KSH ${amount} for ${project.title}`,
        donation: true // Flag to indicate this is a donation
      };

      const result = await authFetch('/contributions', {
        method: 'POST',
        body: JSON.stringify(contributionData)
      });

      setPaymentStatus('success');
      setStatusMessage('Thank you for your donation! ☕ Your support means a lot to the project team!');
      
    } catch (error) {
      console.error('Donation error:', error);
      setPaymentStatus('failed');
      setStatusMessage(error.message || 'Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setDonationAmount('');
    setComment('');
    setPaymentStatus(null);
    setStatusMessage('');
    setErrors({});
    setIsProcessing(false);
    setShowLoginPrompt(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLoginRedirect = () => {
    // You can trigger the login modal here
    // For now, we'll just show a message
toast.error('Please sign in to support this project. Close this dialog and click the Login button.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="bg-[#0a1128] border-2 border-orange-500/30 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
          style={{
            boxShadow: '0 10px 25px rgba(249, 115, 22, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.2)'
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">☕</span>
                <div>
                  <h3 className="text-xl font-bold text-white">Support Project</h3>
                  <p className="text-sm text-white/80">{project.title}</p>
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
            {showLoginPrompt ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <UserIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Login Required
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Please sign in to support this project and help the team continue their amazing work!
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Sign In to Support
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            ) : paymentStatus ? (
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
                {/* User Info */}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Supporting as:</p>
                      <p className="text-sm text-gray-300">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Donation Amount (KSH) *
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount (minimum KSH 100)"
                    min="100"
                    step="0.01"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/10 text-white placeholder-gray-400 ${
                      errors.amount ? 'border-red-400 bg-red-900/20' : 'border-gray-600'
                    }`}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Leave a message of support for the team..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white/10 text-white placeholder-gray-400"
                  />
                </div>

                {/* Total Display */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Donation Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      KSH {donationAmount ? parseFloat(donationAmount).toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={isProcessing || !donationAmount || parseFloat(donationAmount) < 100}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <HeartIcon className="w-5 h-5" />
                      Support Project - KSH {donationAmount ? parseFloat(donationAmount).toFixed(2) : '0.00'}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your contribution helps support the development and maintenance of this project. Thank you! ☕
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
