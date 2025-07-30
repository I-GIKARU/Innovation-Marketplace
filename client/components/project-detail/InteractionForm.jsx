"use client";

import { useState } from "react";

const InteractionForm = ({ project, user, onSubmit, onCancel }) => {
  const [userProjectMessage, setUserProjectMessage] = useState("");
  const [userProjectInterestedIn, setUserProjectInterestedIn] = useState("");

  const handleSubmit = () => {
    if (!userProjectInterestedIn || !userProjectMessage) {
      alert("Please select your interest and provide a message.");
      return;
    }

    const action = userProjectInterestedIn === 'hiring' ? 'hire_team' : 'express_interest';
    onSubmit(action, userProjectInterestedIn, userProjectMessage);
  };

  const getUserRole = () => {
    if (typeof user?.role === 'string') {
      return user.role;
    }
    return user?.role?.name;
  };

  const getFormTitle = () => {
    if (getUserRole() === 'client') {
      return `Connect with ${project.title} Team`;
    }
    return `Join ${project.title} Project`;
  };

  const getSubmitButtonText = () => {
    if (userProjectInterestedIn === 'hire') {
      return 'Send Hire Request';
    } else if (userProjectInterestedIn === 'purchase') {
      return 'Send Purchase Inquiry';
    } else if (userProjectInterestedIn === 'collaboration') {
      return 'Request Collaboration';
    }
    return 'Submit Interest';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {getFormTitle()}
          </h3>
          <p className="text-gray-600">
            {getUserRole() === 'client' 
              ? 'Get in touch with the project team for professional services'
              : 'Join forces with the project team'
            }
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label
              htmlFor="interestedIn"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              I am interested in:
            </label>
            <select
              id="interestedIn"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={userProjectInterestedIn}
              onChange={(e) => setUserProjectInterestedIn(e.target.value)}
            >
              <option value="">Select an option</option>
              {getUserRole() === "student" && (
                <option value="collaboration">Collaboration</option>
              )}
              {getUserRole() === "client" && (
                <>
                  <option value="purchase">Purchase Project</option>
                  <option value="hire">Hire Team</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {userProjectInterestedIn === 'hire' 
                ? 'Describe your project requirements:'
                : userProjectInterestedIn === 'purchase'
                ? 'Tell us about your purchase interest:'
                : 'Message:'
              }
            </label>
            <textarea
              id="message"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={5}
              value={userProjectMessage}
              onChange={(e) => setUserProjectMessage(e.target.value)}
              placeholder={
                userProjectInterestedIn === 'hire'
                  ? 'Describe what you need, timeline, budget, etc...'
                  : userProjectInterestedIn === 'purchase'
                  ? 'What aspects of this project interest you for purchase?'
                  : 'Tell us why you\'re interested...'
              }
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg font-medium"
            >
              {getSubmitButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionForm;
