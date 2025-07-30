"use client";

import { useState } from "react";
import toast from 'react-hot-toast';

const HireForm = ({ project, user, teamMember, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    message: "",
    projectType: "",
    budget: "",
    timeline: "",
    requirements: "",
    contactEmail: user?.email || "",
    contactPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.message || !formData.projectType) {
      toast.error("Please fill in the required fields (message and project type).");
      return;
    }

    onSubmit({
      ...formData,
      project_id: project.id,
      team_member_id: teamMember?.id || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            Hire {teamMember ? `${teamMember.user.name || teamMember.user.email.split('@')[0]}` : 'Team'}
          </h3>
          <p className="text-gray-600 mt-1">
            For project: <span className="font-semibold">{project.title}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Project Description & Requirements *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your project requirements and what you're looking to hire for..."
              required
            />
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
              Project Type *
            </label>
            <select
              id="projectType"
              name="projectType"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.projectType}
              onChange={handleChange}
              required
            >
              <option value="">Select project type</option>
              <option value="full_project">Full Project Development</option>
              <option value="consultation">Consultation & Advisory</option>
              <option value="code_review">Code Review & Optimization</option>
              <option value="feature_development">Feature Development</option>
              <option value="bug_fixes">Bug Fixes & Maintenance</option>
              <option value="integration">System Integration</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Budget and Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select budget range</option>
                <option value="under_1k">Under $1,000</option>
                <option value="1k_5k">$1,000 - $5,000</option>
                <option value="5k_10k">$5,000 - $10,000</option>
                <option value="10k_25k">$10,000 - $25,000</option>
                <option value="25k_plus">$25,000+</option>
                <option value="discuss">To be discussed</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.timeline}
                onChange={handleChange}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1_week">Within 1 week</option>
                <option value="1_month">Within 1 month</option>
                <option value="3_months">Within 3 months</option>
                <option value="6_months">Within 6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          {/* Technical Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Technical Requirements & Specifications
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Any specific technical requirements, technologies, or constraints..."
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg font-medium"
            >
              Send Hire Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HireForm;
