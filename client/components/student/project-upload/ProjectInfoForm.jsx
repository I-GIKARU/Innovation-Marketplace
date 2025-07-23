'use client'

import { FileText } from 'lucide-react'

const ProjectInfoForm = ({ 
  projectData, 
  setProjectData, 
  categories, 
  loadingCategories 
}) => {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Project Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Project Title *</label>
          <input
            type="text"
            value={projectData.title}
            onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tech Stack</label>
          <input
            type="text"
            value={projectData.tech_stack}
            onChange={(e) => setProjectData(prev => ({ ...prev, tech_stack: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React, Node.js, Python..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        {loadingCategories ? (
          <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-500">Loading categories...</span>
          </div>
        ) : (
          <select
            value={projectData.category_id}
            onChange={(e) => setProjectData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={projectData.description}
          onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          placeholder="Describe your project..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">GitHub Link</label>
          <input
            type="url"
            value={projectData.github_link}
            onChange={(e) => setProjectData(prev => ({ ...prev, github_link: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username/repo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Demo Link</label>
          <input
            type="url"
            value={projectData.demo_link}
            onChange={(e) => setProjectData(prev => ({ ...prev, demo_link: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourproject.demo.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Technical Mentor</label>
        <input
          type="text"
          value={projectData.technical_mentor}
          onChange={(e) => setProjectData(prev => ({ ...prev, technical_mentor: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Mentor name"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_for_sale"
          checked={projectData.is_for_sale}
          onChange={(e) => setProjectData(prev => ({ ...prev, is_for_sale: e.target.checked }))}
          className="rounded"
        />
        <label htmlFor="is_for_sale" className="text-sm font-medium">
          This project is for sale
        </label>
      </div>
    </div>
  )
}

export default ProjectInfoForm
