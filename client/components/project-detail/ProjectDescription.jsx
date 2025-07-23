"use client";

const ProjectDescription = ({ 
  project, 
  isEditing, 
  editedDescription, 
  onDescriptionChange 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Description</h2>
      
      {isEditing ? (
        <textarea
          className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={editedDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          placeholder="Enter project description..."
        />
      ) : (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {project.description || "No description available."}
        </p>
      )}
    </div>
  );
};

export default ProjectDescription;
