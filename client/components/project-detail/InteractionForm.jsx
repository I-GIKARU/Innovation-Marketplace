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

    onSubmit(userProjectInterestedIn, userProjectMessage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">
          Express Interest in {project.title}
        </h3>
        
        <div className="mb-4">
          <label
            htmlFor="interestedIn"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            I am interested in:
          </label>
          <select
            id="interestedIn"
            className="w-full p-2 border rounded-md"
            value={userProjectInterestedIn}
            onChange={(e) => setUserProjectInterestedIn(e.target.value)}
          >
            <option value="">Select an option</option>
            {user?.role?.name === "student" && (
              <option value="collaboration">Collaboration</option>
            )}
            {user?.role?.name === "client" && (
              <>
                <option value="buying">Buying</option>
                <option value="hiring">Hiring</option>
              </>
            )}
          </select>
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message:
          </label>
          <textarea
            id="message"
            className="w-full p-2 border rounded-md"
            rows={4}
            value={userProjectMessage}
            onChange={(e) => setUserProjectMessage(e.target.value)}
            placeholder="Tell us why you're interested..."
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Submit Interest
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractionForm;
