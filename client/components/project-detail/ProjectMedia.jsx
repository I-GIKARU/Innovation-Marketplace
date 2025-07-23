"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ProjectMediaComponent from '@/components/common/ProjectMedia';

const ProjectMedia = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Project Media</h2>
      <ProjectMediaComponent project={project} compact={false} />
    </div>
  );
};

export default ProjectMedia;
