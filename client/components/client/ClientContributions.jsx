'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Gift
} from 'lucide-react';
import { useAuthContext } from "@/contexts/AuthContext";

const ClientContributions = ({ contributions: initialContributions, loading: initialLoading, onRefresh }) => {
  const [contributions, setContributions] = useState(initialContributions || []);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalAmount: 0,
    projectsSupported: 0
  });

  useEffect(() => {
    if (initialContributions) {
        setContributions(initialContributions);
        // Calculate statistics
        const totalAmount = initialContributions.reduce((sum, contrib) => sum + (contrib.amount || 0), 0);
        const uniqueProjects = new Set(initialContributions.map(contrib => contrib.user_project?.project?.id)).size;
        
        setStats({
            totalContributions: initialContributions.length,
            totalAmount: totalAmount,
            projectsSupported: uniqueProjects
        });
    }
  }, [initialContributions]);

  const fetchContributions = async () => {
    if (onRefresh) {
        onRefresh();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KSH'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-lg text-gray-600">Loading your contributions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Contributions</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchContributions}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Contributions</h1>
          <p className="text-gray-600 mt-1">Track your support for amazing projects</p>
        </div>
        <button
          onClick={fetchContributions}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total Contributions</p>
              <p className="text-3xl font-bold">{stats.totalContributions}</p>
            </div>
            <Heart className="w-10 h-10 text-pink-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Amount</p>
              <p className="text-3xl font-bold">{formatAmount(stats.totalAmount)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Projects Supported</p>
              <p className="text-3xl font-bold">{stats.projectsSupported}</p>
            </div>
            <Gift className="w-10 h-10 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Contributions</h2>
        </div>
        
        {contributions.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions yet</h3>
            <p className="text-gray-500">
              Start supporting amazing projects by browsing our marketplace and clicking "Support Project"
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {contributions.map((contribution) => {
              const project = contribution.user_project?.project;
              return (
                <div key={contribution.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project?.title || 'Unknown Project'}
                        </h3>
                        {project && (
                          <a
                            href={`/projects/${project.id}`}
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium text-green-600">
                            {formatAmount(contribution.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(contribution.date)}</span>
                        </div>
                      </div>
                      
                      {contribution.comment && (
                        <div className="flex items-start gap-2 mt-3">
                          <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                          <p className="text-gray-600 text-sm italic">
                            "{contribution.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientContributions;
