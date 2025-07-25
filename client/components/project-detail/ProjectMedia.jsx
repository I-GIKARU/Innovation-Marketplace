"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ProjectMediaComponent from '@/components/common/ProjectMedia';

const ProjectMedia = ({ project }) => {
  return (
    <div>
      <ProjectMediaComponent project={project} compact={false} />
    </div>
  );
};

export default ProjectMedia;
