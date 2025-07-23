"use client";

import Image from "next/image";
import { FiMail, FiStar } from "react-icons/fi";

const ProjectTeamAndReviews = ({ project, teamMembers, projectReviews, canWriteReview, onWriteReview }) => {
  const defaultUserAvatar = "/images/default-avatar.png";

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Team Members Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Team Members</h3>
        
        {teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((up) => (
              <div
                key={up.id || up.user.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  up.isExternal ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {up.isExternal 
                    ? up.user.name.charAt(0).toUpperCase() || 'C'
                    : up.user.email.charAt(0).toUpperCase()
                  }
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {up.isExternal 
                      ? up.user.name || 'Collaborator'
                      : up.user.email.split('@')[0]
                    }
                  </h4>
                  {up.isExternal ? (
                    <div className="space-y-1">
                      {up.user.github && (
                        <a 
                          href={up.user.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:text-blue-800 block truncate"
                        >
                          {up.user.github}
                        </a>
                      )}
                      {up.user.email && (
                        <p className="text-sm text-gray-600">{up.user.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{up.user.email}</p>
                  )}
                  
                  {up.user.role && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      up.isExternal 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {up.isExternal ? 'External Collaborator' : up.user.role.name}
                    </span>
                  )}
                  
                  {up.user.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {up.user.bio}
                    </p>
                  )}
                  
                  {up.user.email && (
                    <a
                      href={`mailto:${up.user.email}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      <FiMail className="w-4 h-4 mr-1" />
                      Contact
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No team members listed for this project.
          </p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
          
          {/* Write review button */}
          {canWriteReview && (
            <button
              onClick={onWriteReview}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FiStar className="w-4 h-4 mr-2" />
              Write a Review
            </button>
          )}
        </div>
        
        {projectReviews && projectReviews.length > 0 ? (
          <div className="space-y-6">
            {projectReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-medium text-gray-900">
                      {review.rating}/5
                    </span>
                    <span className="text-sm text-gray-500">
                      by {review.user ? review.user.email.split('@')[0] : 'Anonymous'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No reviews yet. Be the first to review this project!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectTeamAndReviews;
