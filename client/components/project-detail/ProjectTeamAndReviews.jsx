"use client";

import Image from "next/image";
import { FiMail, FiStar, FiBriefcase, FiUser } from "react-icons/fi";
import { useState } from "react";
import TeamMemberDialog from "./TeamMemberDialog";

const ProjectTeamAndReviews = ({ project, teamMembers, projectReviews, canWriteReview, onWriteReview }) => {
  const defaultUserAvatar = "/images/default-avatar.png";
  const [selectedMember, setSelectedMember] = useState(null);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-12">
      {/* Team Members Section */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.25 2.25 0 01-2.25 2.25H2.25A2.25 2.25 0 010 18.75v-1.5A2.25 2.25 0 012.25 15h15a2.25 2.25 0 012.25 2.25v1.5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Team Members</h3>
        </div>
        
        {teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamMembers.map((up) => (
              <div
                key={up.id || up.user.id}
                className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/15 transition-all duration-300"
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
                  <h4 className="font-semibold text-white truncate">
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
                        <p className="text-sm text-gray-300">{up.user.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300">{up.user.email}</p>
                  )}
                  
                  {up.user.role && (
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      up.isExternal 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {up.isExternal ? 'Collaborator' : up.user.role.name}
                    </span>
                  )}
                  
                  {up.user.bio && (
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                      {up.user.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-3">
                    {up.user.email && (
                      <a
                        href={`mailto:${up.user.email}`}
                        className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiMail className="w-4 h-4 mr-1" />
                        Contact
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(up);
                      }}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      <FiUser className="w-3 h-3 mr-1" />
                      Hire This Team
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-8">
            No team members listed for this project.
          </p>
        )}
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Reviews & Ratings</h3>
          </div>
          
          {/* Write review button */}
          {canWriteReview && (
            <button
              onClick={onWriteReview}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg font-semibold"
            >
              <FiStar className="w-4 h-4 mr-2" />
              Write a Review
            </button>
          )}
        </div>
        
        {projectReviews && projectReviews.length > 0 ? (
          <div className="space-y-6">
            {projectReviews.map((review) => (
              <div key={review.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="font-medium text-white">
                      {review.rating}/5
                    </span>
                    <span className="text-sm text-gray-300">
                      by {review.user ? review.user.email.split('@')[0] : (review.email ? review.email.split('@')[0] : 'Anonymous')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-200 leading-relaxed mt-3">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-8">
            No reviews yet. Be the first to review this project!
          </p>
        )}
      </div>
      
      {/* Team Member Details Dialog */}
      {selectedMember && (
        <TeamMemberDialog 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}
    </div>
  );
};

export default ProjectTeamAndReviews;
