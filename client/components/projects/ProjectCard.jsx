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
            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 overflow-hidden flex flex-col">

                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                    <Image
                        src={projectImage}
                        alt={project.title || title || "Project"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={() => {
                            console.error('Image failed to load:', projectImage);
                        }}
                        unoptimized={process.env.NODE_ENV === 'development'}
                    />
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3">
                        {project.featured && (
                            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                <FiStar className="w-3 h-3" />
                                Featured
                            </div>
                        )}
                    </div>
                    {/* Category Badge */}
                    {project.category && (
                        <div className="absolute top-3 right-3 bg-[#0a1128]/90 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {project.category.name}
                        </div>
                    )}
                    {/* Action Icons */}
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {project.source_code_url && (
                            <div className="bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-lg hover:bg-white transition-colors" onClick={handleLinkClick}>
                                <FiGithub className="w-4 h-4 text-[#0a1128]" />
                            </div>
                        )}
                        {project.demo_url && (
                            <div className="bg-white/90 p-2 rounded-full backdrop-blur-sm shadow-lg hover:bg-white transition-colors" onClick={handleLinkClick}>
                                <FiExternalLink className="w-4 h-4 text-[#0a1128]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                        {/* Category Label */}
                        <div className="mb-2">
                            <span className="text-xs text-[#0a1128] font-semibold uppercase tracking-wider">
                                {project.category?.name || 'Project'}
                            </span>
                        </div>

                        {/* Title and Sale Badge */}
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                {project.title || title}
                            </h3>
                            {project.is_for_sale && (
                                <div className="ml-2 bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <FiDollarSign className="w-3 h-3" />
                                    For Sale
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {project.description || description || 'Innovative project with exceptional design and functionality.'}
                        </p>

                        {/* Tech Stack */}
                        {project.tech_stack && (
                            <div className="flex flex-wrap gap-1 mb-4">
                                {project.tech_stack.split(',').slice(0, 3).map((tech, index) => (
                                    <span key={index} className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                        {tech.trim()}
                                    </span>
                                ))}
                                {project.tech_stack.split(',').length > 3 && (
                                    <span className="text-gray-400 text-xs self-center font-medium">
                                        +{project.tech_stack.split(',').length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Mentor */}
                        {project.technical_mentor && (
                            <div className="px-3 py-2 bg-blue-50 rounded-xl mb-4">
                                <p className="text-sm text-blue-700 font-medium">
                                    👨‍🏫 Mentored by {project.technical_mentor}
                                </p>
                            </div>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-4 items-center text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <FiEye className="w-4 h-4" />
                                    <span className="font-medium">{project.views || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">{getTeamMembersCount(project)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Author and CTA Button */}
                    <div className="mt-auto">
                        {/* Author Info */}
                        {project.user_projects && project.user_projects[0]?.user && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[#0a1128] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {project.user_projects[0].user.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {project.user_projects[0].user.email.split('@')[0]}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* CTA Button */}
                        <button className="w-full bg-[#0a1128] hover:bg-orange-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );


};

export default ProjectCard;
