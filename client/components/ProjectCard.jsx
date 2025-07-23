"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiGithub, FiExternalLink, FiEye, FiDownload, FiStar, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { ShoppingCart, Users, Calendar } from "lucide-react";
import ProjectMedia from '@/components/common/ProjectMedia';

const ProjectCard = ({ project, title, description, image, bgColor, onAddToCart, onProjectClick }) => {
    const defaultImage = "/images/marketplace.png"; // Use local fallback image

    if (!project) {
        return null;
    }

    // Use thumbnail_url from backend first, then fallback to image prop, then default
    const projectImage = project.thumbnail_url || image || defaultImage;
    
    // Get correct team members count
    const getTeamMembersCount = (project) => {
        const registeredMembers = project?.user_projects?.filter(
            (up) => up.interested_in === "contributor" && up.user
        ) || [];
        
        let externalMembers = [];
        if (project?.external_collaborators) {
            try {
                externalMembers = typeof project.external_collaborators === 'string' 
                    ? JSON.parse(project.external_collaborators)
                    : project.external_collaborators;
            } catch (e) {
                externalMembers = [];
            }
        }
        
        return registeredMembers.length + (externalMembers?.length || 0);
    };

    const handleCardClick = () => {
        if (onProjectClick && project?.id) {
            onProjectClick(project.id);
        }
    };

    const handleLinkClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Link href={`/projects/${project.id}`}>
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 overflow-hidden">

                {/* Project Image */}
                <div className="relative h-44 overflow-hidden">
                    <Image
                        src={projectImage}
                        alt={project.title || title || "Project"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                            console.error('Image failed to load:', projectImage);
                        }}
                        unoptimized={process.env.NODE_ENV === 'development'}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 flex gap-1">
                        {project.featured && (
                            <div className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                                <FiStar className="w-3 h-3" />
                                Featured
                            </div>
                        )}
                    </div>
                    {/* Category Badge */}
                    {project.category && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs">
                            {project.category.name}
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-3 flex flex-col gap-2">
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {project.title || title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description || description}
                    </p>

                    {/* Tech Stack */}
                    {project.tech_stack && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.tech_stack.split(',').slice(0, 3).map((tech, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                {tech.trim()}
              </span>
                            ))}
                            {project.tech_stack.split(',').length > 3 && (
                                <span className="text-gray-500 text-xs">
                +{project.tech_stack.split(',').length - 3} more
              </span>
                            )}
                        </div>
                    )}

                    {/* Mentor */}
                    {project.technical_mentor && (
                        <div className="px-2 py-1 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700 font-medium">
                                👨‍🏫 Mentor: {project.technical_mentor}
                            </p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center gap-1">
                                <FiEye className="w-3 h-3" />
                                {project.views || 0}
                            </div>
                            <div className="flex items-center gap-1">
                                <FiDownload className="w-3 h-3" />
                                {project.downloads || 0}
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {getTeamMembersCount(project)} member{getTeamMembersCount(project) !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-1">
                        {/* Author */}
                        {project.user_projects && project.user_projects[0]?.user && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                                    {project.user_projects[0].user.email.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-600 truncate max-w-[5rem]">
                {project.user_projects[0].user.email.split('@')[0]}
              </span>
                            </div>
                        )}

                        {/* Right side actions */}
                        <div className="flex items-center gap-1.5">
                            {project.is_for_sale && (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                <FiDollarSign className="w-3 h-3" />
                For Sale
              </span>
                            )}
                            <div className="p-1 bg-blue-50 text-blue-600 rounded group-hover:bg-blue-100 transition-colors">
                                <FiArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );


};

export default ProjectCard;
