'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectsHero from '@/components/projects/ProjectsHero';
import { Search, RefreshCw, ChevronDown, AlertCircle } from 'lucide-react';

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = ({ onRefresh }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
    >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
            No approved projects at the moment. Check back later!
        </p>
        <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
        </button>
    </motion.div>
);

const ErrorState = ({ error, onRetry }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
    >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
            {error || 'Failed to load projects. Please try again.'}
        </p>
        <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
        </button>
    </motion.div>
);

const Projects = () => {
    const {
        projects,
        fetchProjects,
        loading,
        error,
        isCached,
        refreshProjects
    } = useProjects();
    const { categories, fetchCategories } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode] = useState('grid');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchProjects({ per_page: 20 });
        fetchCategories();
    }, [fetchProjects, fetchCategories]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshProjects({ per_page: 20 });
        } catch (err) {
            console.error('Refresh failed:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleRetry = () => {
        fetchProjects({ per_page: 20, forceRefresh: true });
    };

    const filteredProjects = projects.filter((project) => {
        const matchesCategory =
            selectedCategory === '' || project.category_id === parseInt(selectedCategory);
        const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <ProjectsHero projects={projects} />
            <section className="min-h-screen bg-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-[#0a1128]">Browse Projects</h3>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center lg:items-center">
                                <div className="relative">
                                    <ChevronDown className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full sm:w-64 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full sm:w-64 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={loading || isRefreshing}
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
                                        <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        {loading && !isCached ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <LoadingSkeleton />
                            </motion.div>
                        ) : error ? (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <ErrorState error={error} onRetry={handleRetry} />
                            </motion.div>
                        ) : filteredProjects.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <EmptyState onRefresh={handleRefresh} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                        <ProjectCard project={project} viewMode={viewMode} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </>
    );
};

export default Projects;
