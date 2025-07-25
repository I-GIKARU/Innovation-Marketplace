"use client";

const ProjectDescription = ({ 
  project, 
  isEditing, 
  editedDescription, 
  onDescriptionChange 
}) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Project Description</h2>
      </div>
      
      {isEditing ? (
        <textarea
          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
          value={editedDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={8}
          placeholder="Enter project description..."
        />
      ) : (
        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
          {project.description || "No description available."}
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;
