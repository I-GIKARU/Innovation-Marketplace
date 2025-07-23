"use client";

import { FiDownload, FiEdit, FiTrash2, FiMessageSquare, FiStar } from "react-icons/fi";

const ProjectActions = ({
  project,
  isEditing,
  canEditOrDelete,
  canExpressInterest,
  canWriteReview,
  onDownload,
  onEdit,
  onSave,
  onDelete,
  onExpressInterest,
  onWriteReview
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Actions</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Download button for purchasable projects */}
        {project.is_for_sale && (
          <button
            onClick={onDownload}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Download
          </button>
        )}

        {/* Edit/Save buttons */}
        {canEditOrDelete && (
          <>
            {isEditing ? (
              <button
                onClick={onSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit Project
              </button>
            )}
            
            <button
              onClick={onDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Delete Project
            </button>
          </>
        )}

        {/* Express interest button */}
        {canExpressInterest && (
          <button
            onClick={onExpressInterest}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiMessageSquare className="w-4 h-4 mr-2" />
            Express Interest
          </button>
        )}

      </div>
    </div>
  );
};

export default ProjectActions;
