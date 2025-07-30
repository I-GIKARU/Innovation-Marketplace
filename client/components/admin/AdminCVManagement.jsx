'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, 
    Eye, 
    MessageSquare, 
    Search, 
    Calendar, 
    User,
    Loader2,
    AlertCircle,
    X
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

const AdminCVManagement = ({ cvs: initialCvs = [], loading: initialLoading = false, error: initialError = null, onRefresh }) => {
    const { authFetch } = useAuthContext();
    const [cvs, setCvs] = useState(initialCvs);
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(initialError);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCV, setSelectedCV] = useState(null);
    const [showQAModal, setShowQAModal] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [askingQuestion, setAskingQuestion] = useState(false);

    React.useEffect(() => {
        setCvs(initialCvs);
        setLoading(initialLoading);
        setError(initialError);
    }, [initialCvs, initialLoading, initialError]);


    const fetchCVs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authFetch('/ai/admin/cvs');
            setCvs(response.cvs || []);
            if (onRefresh) onRefresh();
        } catch (err) {
            setError(err.message || 'Failed to fetch CVs');
        } finally {
            setLoading(false);
        }
    };

    const handleViewCV = (cvUrl) => {
        window.open(cvUrl, '_blank');
    };

    const handleAskQuestion = async (userId) => {
        if (!question.trim()) return;
        
        setAskingQuestion(true);
        try {
            const response = await authFetch(`/ai/cv/${userId}/question`, {
                method: 'POST',
                body: JSON.stringify({ question: question.trim() })
            });
            setAnswer(response.answer);
        } catch (err) {
            setAnswer('Failed to get answer: ' + err.message);
        } finally {
            setAskingQuestion(false);
        }
    };

    const openQAModal = (cv) => {
        setSelectedCV(cv);
        setShowQAModal(true);
        setQuestion('');
        setAnswer('');
    };

    const closeQAModal = () => {
        setShowQAModal(false);
        setSelectedCV(null);
        setQuestion('');
        setAnswer('');
    };

    const filteredCVs = cvs.filter(cv => 
        cv.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cv.cv_summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading CVs...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-800">Error: {error}</span>
                    </div>
                    <button 
                        onClick={onRefresh || fetchCVs}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-blue-600" />
                        Student CVs Management
                    </h1>
                    <p className="text-gray-600 mt-1">Review and analyze student CVs with AI assistance</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-blue-800 font-medium">{cvs.length} CVs uploaded</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by student email or CV content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* CVs Grid */}
            {filteredCVs.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? 'No CVs match your search criteria' : 'No students have uploaded CVs yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCVs.map((cv) => (
                        <motion.div
                            key={cv.user_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                {/* Student Info */}
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="ml-3 flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{cv.email}</h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {formatDate(cv.cv_uploaded_at)}
                                        </div>
                                    </div>
                                </div>

                                {/* CV Summary */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary</h4>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {cv.cv_summary || 'No summary available'}
                                    </p>
                                </div>

                                {/* Contact Info */}
                                {(cv.phone || cv.bio) && (
                                    <div className="mb-4 space-y-1">
                                        {cv.phone && (
                                            <p className="text-xs text-gray-500">📞 {cv.phone}</p>
                                        )}
                                        {cv.socials && (
                                            <p className="text-xs text-gray-500">🔗 {cv.socials}</p>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleViewCV(cv.cv_url)}
                                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-1" />
                                        View CV
                                    </button>
                                    <button
                                        onClick={() => openQAModal(cv)}
                                        className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Ask AI
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Q&A Modal */}
            <AnimatePresence>
                {showQAModal && selectedCV && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={closeQAModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Ask AI about CV</h2>
                                    <p className="text-sm text-gray-600">{selectedCV.email}</p>
                                </div>
                                <button
                                    onClick={closeQAModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ask a question about this CV
                                    </label>
                                    <textarea
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g., What programming languages does this candidate know? What is their experience level?"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows={3}
                                    />
                                </div>

                                <button
                                    onClick={() => handleAskQuestion(selectedCV.user_id)}
                                    disabled={!question.trim() || askingQuestion}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {askingQuestion ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Thinking...
                                        </>
                                    ) : (
                                        <>
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Ask Question
                                        </>
                                    )}
                                </button>

                                {answer && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">AI Response:</h4>
                                        <div className="text-gray-700 whitespace-pre-wrap">{answer}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCVManagement;

