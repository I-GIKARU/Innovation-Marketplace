"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";
import toast from 'react-hot-toast';

const ReviewForm = ({ project, user, onSubmit, onCancel }) => {
  const [reviewRating, setReviewRating] = useState(1);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      toast.error("Please provide a rating between 1 and 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reviewRating, reviewComment);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => setReviewRating(starValue)}
          className={`text-2xl transition-colors ${
            starValue <= reviewRating
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <FiStar className={starValue <= reviewRating ? 'fill-current' : ''} />
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-2">
          Write a Review for {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {user ? `Reviewing as ${user.email.split('@')[0]}` : 'Your review will be posted anonymously'}
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating:
          </label>
          <div className="flex items-center gap-1">
            {renderStarRating()}
            <span className="ml-2 text-sm text-gray-600">
              {reviewRating}/5
            </span>
          </div>
        </div>
        
        
        <div className="mb-4">
          <label
            htmlFor="reviewComment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment:
          </label>
          <textarea
            id="reviewComment"
            className="w-full p-2 border rounded-md"
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your thoughts on this project..."
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
