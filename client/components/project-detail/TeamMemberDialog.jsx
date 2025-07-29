import React from "react";
import { FiMail, FiPhone, FiUser, FiGithub, FiGlobe } from "react-icons/fi";

const TeamMemberDialog = ({ member, onClose }) => {
  if (!member) return null;

  // Extract user data from the member object
  const userData = member.user || member;
  const isExternal = member.isExternal;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
            isExternal ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
          }`}>
            {isExternal 
              ? userData.name?.charAt(0).toUpperCase() || 'C'
              : userData.email?.charAt(0).toUpperCase() || 'U'
            }
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {isExternal 
                ? userData.name || 'Collaborator'
                : userData.email?.split('@')[0] || 'Team Member'
              }
            </h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              isExternal 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isExternal ? 'Collaborator' : userData.role || 'Student'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {userData.email && (
            <div className="flex items-center gap-3">
              <FiMail className="w-4 h-4 text-gray-500" />
              <div>
                <strong className="text-sm text-gray-600">Email:</strong>
                <p className="text-gray-800">{userData.email}</p>
              </div>
            </div>
          )}

          {userData.phone && (
            <div className="flex items-center gap-3">
              <FiPhone className="w-4 h-4 text-gray-500" />
              <div>
                <strong className="text-sm text-gray-600">Phone:</strong>
                <p className="text-gray-800">{userData.phone}</p>
              </div>
            </div>
          )}

          {userData.bio && (
            <div className="flex items-start gap-3">
              <FiUser className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <strong className="text-sm text-gray-600">Bio:</strong>
                <p className="text-gray-800">{userData.bio}</p>
              </div>
            </div>
          )}

          {userData.past_projects && (
            <div className="flex items-start gap-3">
              <FiGlobe className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <strong className="text-sm text-gray-600">Past Projects:</strong>
                <p className="text-gray-800">{userData.past_projects}</p>
              </div>
            </div>
          )}

          {userData.socials && (
            <div className="flex items-start gap-3">
              <FiGlobe className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <strong className="text-sm text-gray-600">Social Links:</strong>
                <p className="text-gray-800">{userData.socials}</p>
              </div>
            </div>
          )}

          {userData.github && (
            <div className="flex items-center gap-3">
              <FiGithub className="w-4 h-4 text-gray-500" />
              <div>
                <strong className="text-sm text-gray-600">GitHub:</strong>
                <a 
                  href={userData.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {userData.github}
                </a>
              </div>
            </div>
          )}

          {/* Show message if most fields are empty */}
          {!userData.bio && !userData.phone && !userData.past_projects && !userData.socials && !userData.github && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">
                This team member hasn't provided additional profile information yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDialog;

