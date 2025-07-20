'use client';
import React, { useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';

const Project = () => {
  const {
    projects,
    fetchProjects,
    loading,
    error,
  } = useProjects();

  useEffect(() => {
    fetchProjects({ featured: true }); // ✅ Only fetch featured projects
  }, [fetchProjects]);

  return (
      <section className="bg-[#D9D9D9] py-12 px-5">
        <h3 className="text-4xl font-extrabold text-gray-900 text-center mb-7">
          Featured <span className="text-orange-500">Projects</span>
        </h3>

        {loading && (
            <p className="text-center text-gray-700">Loading featured projects...</p>
        )}
        {error && (
            <p className="text-center text-red-500">Error: {error}</p>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
          {projects.length === 0 && !loading && (
              <p className="col-span-full text-center text-gray-600">
                No featured projects available.
              </p>
          )}

          {projects.map((project) =>
              project ? (
                  <ProjectCard key={project.id} project={project} />
              ) : null
          )}
        </div>
      </section>
  );
};

export default Project;
