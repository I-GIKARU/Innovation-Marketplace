'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

const ProjectQA = ({ isOpen, onClose, project }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

    const handleAskQuestion = async () => {
        if (!question.trim()) {
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError('');
        setAnswer('');

        try {
            const response = await fetch(`${API_BASE}/ai/project/${project.id}/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question.trim() }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get answer');
            }

            setAnswer(data.answer);
            
            // Add to history
            const newQA = {
                question: question.trim(),
                answer: data.answer,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setHistory(prev => [newQA, ...prev]);
            setQuestion('');

        } catch (error) {
            setError(error.message || 'Failed to get answer');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAskQuestion();
        }
    };

    const resetForm = () => {
        setQuestion('');
        setAnswer('');
        setError('');
        setHistory([]);
        setLoading(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen || !project) return null;

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
                    className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Ask AI about this Project</h2>
                                <p className="text-sm text-gray-600">{project.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Question Input Area */}
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ask anything about "{project.title}"
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="e.g., What technologies were used? How does this project work? What problem does it solve?"
                                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            rows={3}
                                            disabled={loading}
                                        />
                                        <div className="absolute bottom-3 right-3">
                                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                {/* Ask Button */}
                                <div className="flex justify-end">
                                    <motion.button
                                        onClick={handleAskQuestion}
                                        disabled={!question.trim() || loading}
                                        whileHover={{ scale: question.trim() && !loading ? 1.02 : 1 }}
                                        whileTap={{ scale: question.trim() && !loading ? 0.98 : 1 }}
                                        className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                            question.trim() && !loading
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Thinking...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-4 h-4" />
                                                <span>Ask AI</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        {/* Conversation Area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {answer && (
                                <div className="mb-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <SparklesIcon className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                                                <div className="prose prose-sm max-w-none">
                                                    <div className="whitespace-pre-wrap text-gray-700">{answer}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Conversation History */}
                            {history.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                        Previous Questions
                                    </h3>
                                    {history.map((qa, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                                            <div className="mb-3">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">Q</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{qa.timestamp}</span>
                                                </div>
                                                <p className="text-gray-900 font-medium">{qa.question}</p>
                                            </div>
                                            <div className="pl-8">
                                                <div className="flex items-start space-x-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white text-xs font-bold">A</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-gray-700 text-sm whitespace-pre-wrap">{qa.answer}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* No questions yet */}
                            {!answer && history.length === 0 && (
                                <div className="text-center py-12">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ask your first question!</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        I can help you understand this project better. Ask about the technologies used, 
                                        features, implementation details, or anything else you're curious about.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                                💡 Press Enter to ask, Shift+Enter for new line
                            </p>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProjectQA;
