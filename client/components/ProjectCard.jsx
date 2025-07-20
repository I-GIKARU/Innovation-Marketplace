// components/ProjectCard.js
"use client";
import React from 'react';
import Link from 'next/link';
import { FiGithub, FiExternalLink, FiEye, FiDownload, FiStar } from 'react-icons/fi';

const ProjectCard = ({ project, onProjectClick }) => {
    const defaultImage = "https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg";

    const handleCardClick = () => {
        if (onProjectClick) {
            onProjectClick(project.id);
        }
    };

    const handleLinkClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative">
                <img 
                    src={defaultImage} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                {project.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <FiStar className="w-3 h-3 mr-1" />
                        Featured
                    </div>
                )}
                {project.is_for_sale && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        For Sale
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {project.title}
                    </h3>
                    {project.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {project.category.name}
                        </span>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {project.description}
                </p>

                {project.tech_stack && (
                    <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Tech Stack:</p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                            {project.tech_stack}
                        </p>
                    </div>
                )}

                {project.technical_mentor && (
                    <p className="text-xs text-gray-500 mb-3">
                        Mentor: {project.technical_mentor}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                            <FiEye className="w-3 h-3 mr-1" />
                            {project.views || 0} views
                        </span>
                        <span className="flex items-center">
                            <FiDownload className="w-3 h-3 mr-1" />
                            {project.downloads || 0} downloads
                        </span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {project.status}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {project.github_link && (
                            <a 
                                href={project.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 hover:text-gray-900 text-sm"
                                onClick={handleLinkClick}
                            >
                                <FiGithub className="w-4 h-4 mr-1" />
                                Code
                            </a>
                        )}
                        {project.demo_link && (
                            <a 
                                href={project.demo_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                onClick={handleLinkClick}
                            >
                                <FiExternalLink className="w-4 h-4 mr-1" />
                                Demo
                            </a>
                        )}
                    </div>
                    <Link 
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={handleLinkClick}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
