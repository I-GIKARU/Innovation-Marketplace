'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, DocumentTextIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAuthContext } from '@/contexts/AuthContext';

const CVUpload = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const { authFetch } = useAuthContext();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Please select a PDF file');
                setFile(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a CV file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await authFetch('/ai/cv/upload', {
                method: 'POST',
                body: formData,
            });

            setSummary(response.summary);
            
            if (onUploadSuccess) {
                onUploadSuccess(response);
            }

            // Auto-close after 3 seconds of showing summary
            setTimeout(() => {
                onClose();
            }, 3000);

        } catch (error) {
            setError(error.message || 'Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setSummary('');
        setError('');
        setUploading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Upload Your CV</h2>
                                <p className="text-sm text-gray-500">Upload your CV and get an AI-generated summary</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {!summary ? (
                            <div className="space-y-6">
                                {/* File Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                    <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-lg font-medium text-gray-900">
                                            {file ? file.name : 'Choose your CV file'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Only PDF files are supported
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="mt-4 block w-full text-sm text-gray-500
                                                 file:mr-4 file:py-2 file:px-4
                                                 file:rounded-lg file:border-0
                                                 file:text-sm file:font-medium
                                                 file:bg-blue-50 file:text-blue-700
                                                 hover:file:bg-blue-100
                                                 file:cursor-pointer cursor-pointer"
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        onClick={handleUpload}
                                        disabled={!file || uploading}
                                        whileHover={{ scale: file && !uploading ? 1.02 : 1 }}
                                        whileTap={{ scale: file && !uploading ? 0.98 : 1 }}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                            file && !uploading
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {uploading ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            'Upload CV'
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Success Message */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-green-800">CV uploaded successfully!</p>
                                    </div>
                                </div>

                                {/* AI-Generated Summary */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated CV Summary</h3>
                                    <div className="prose prose-sm max-w-none">
                                        <div className="whitespace-pre-wrap text-gray-700">{summary}</div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CVUpload;

