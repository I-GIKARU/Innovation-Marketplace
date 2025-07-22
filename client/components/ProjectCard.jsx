"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiGithub, FiExternalLink, FiEye, FiDownload, FiStar } from 'react-icons/fi';
import { ShoppingCart } from "lucide-react";

const ProjectCard = ({ project, title, description, image, bgColor, onAddToCart, onProjectClick }) => {
    const defaultImage = "https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg";

    if (!project) {
        return null;
    }

    const handleCardClick = () => {
        if (onProjectClick && project?.id) {
            onProjectClick(project.id);
        }
    };

    const handleLinkClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={`rounded-xl p-4 ${bgColor} shadow-md cursor-pointer`} onClick={handleCardClick}>
            <h2 className="font-bold mb-2">{title}</h2>
            <div className="flex gap-2">
                <div className="flex-1 text-sm">{description}</div>
                <Image
                    src={image || defaultImage}
                    alt={title}
                    width={80}
                    height={80}
                    className="rounded-xl"
                />
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    <Image
                        src="/images/profile.jpg"
                        alt="profile"
                        width={24}
                        height={24}
                        className="rounded-full"
                    />
                    <button
                        onClick={onAddToCart}
                        className="p-2 bg-black text-white rounded-full hover:bg-gray-800"
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
                <div className="flex space-x-2">
                    {project?.github_link && (
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
                    {project?.demo_link && (
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
            </div>
        </div>
    );
};

export default ProjectCard;
