'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Star, MessageSquare, Calendar, User, ExternalLink } from 'lucide-react'

const StudentReviews = ({ dashboardData }) => {
  const [allReviews, setAllReviews] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (dashboardData?.projects) {
      // Extract all reviews from projects
      const reviews = []
      dashboardData.projects.forEach(project => {
        if (project.reviews && project.reviews.length > 0) {
          project.reviews.forEach(review => {
            reviews.push({
              ...review,
              projectTitle: project.title,
              projectId: project.id,
              projectThumbnail: project.thumbnail_url
            })
          })
        }
      })
      setAllReviews(reviews.sort((a, b) => new Date(b.date) - new Date(a.date)))
    }
  }, [dashboardData])

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getAverageRating = () => {
    if (allReviews.length === 0) return 0
    const sum = allReviews.reduce((acc, review) => acc + (review.rating || 0), 0)
    return (sum / allReviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    allReviews.forEach(review => {
      if (review.rating) {
        distribution[review.rating]++
      }
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()
  const totalReviews = allReviews.length

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Feedback</h2>
        <p className="text-gray-600">See what others are saying about your projects</p>
      </div>

      {/* Reviews Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Rating */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {getAverageRating()}
            </div>
            <div className="flex justify-center space-x-1 mb-2">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-xs text-gray-500 mt-1">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 w-3">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: totalReviews > 0 ? `${(ratingDistribution[rating] / totalReviews) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {ratingDistribution[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Review Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Reviews</span>
              <span className="font-semibold text-gray-900">{totalReviews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Projects with Reviews</span>
              <span className="font-semibold text-gray-900">
                {dashboardData?.projects?.filter(p => p.reviews && p.reviews.length > 0).length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average per Project</span>
              <span className="font-semibold text-gray-900">
                {dashboardData?.projects?.length > 0 ? (totalReviews / dashboardData.projects.length).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
        </div>

        {allReviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Your projects haven't received any reviews yet. Share them to get feedback!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allReviews.map((review, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Project Thumbnail */}
                  <div className="flex-shrink-0">
                    {review.projectThumbnail ? (
                      <img
                        src={review.projectThumbnail}
                        alt={review.projectTitle}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {review.projectTitle?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 truncate">
                          {review.projectTitle}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex space-x-1">
                            {renderStars(review.rating || 0)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {review.date ? new Date(review.date).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    {review.comment && (
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                        {review.comment}
                      </p>
                    )}

                    {/* Reviewer Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {review.user?.email ? review.user.email.split('@')[0] : 'Anonymous'}
                        </span>
                      </div>
                      
                      {review.projectId && (
                        <button 
                          onClick={() => window.open(`/projects/${review.projectId}`, '_blank')}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Project
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentReviews
