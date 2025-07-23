'use client'

import { Users, Plus, Trash2 } from 'lucide-react'

const CollaboratorsForm = ({ collaborators, setCollaborators }) => {
  const handleCollaboratorChange = (index, field, value) => {
    const newCollaborators = [...collaborators]
    newCollaborators[index][field] = value
    setCollaborators(newCollaborators)
  }
  
  const addCollaborator = () => {
    setCollaborators([...collaborators, { name: '', github: '' }])
  }
  
  const removeCollaborator = (index) => {
    if (collaborators.length > 1) {
      setCollaborators(collaborators.filter((_, i) => i !== index))
    } else {
      setCollaborators([{ name: '', github: '' }])
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Collaborators
      </label>
      <div className="space-y-3">
        {collaborators.map((collaborator, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={collaborator.name}
                onChange={(e) => handleCollaboratorChange(index, 'name', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Collaborator name"
              />
              <input
                type="url"
                value={collaborator.github}
                onChange={(e) => handleCollaboratorChange(index, 'github', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username"
              />
            </div>
            <button
              type="button"
              onClick={() => removeCollaborator(index)}
              className="mt-2 p-2 text-red-500 hover:bg-red-100 rounded-lg text-sm flex items-center gap-1"
              title="Remove collaborator"
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCollaborator}
          className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
        >
          <Plus className="w-4 h-4" />
          Add Collaborator
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Add names and GitHub profiles of team members who worked on this project. At least one field (name or GitHub) is required per collaborator.
        </p>
      </div>
    </div>
  )
}

export default CollaboratorsForm
