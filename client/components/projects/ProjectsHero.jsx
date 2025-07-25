'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  CodeBracketIcon, 
  StarIcon, 
  ArrowRightIcon, 
  AcademicCapIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ProjectsHero = ({ projects = [] }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  // Use passed projects or filter featured projects from the array
  // Ensure projects is always an array to prevent runtime errors
  const safeProjects = Array.isArray(projects) ? projects : [];
  const featuredProjects = safeProjects.filter(project => project.featured);
  
  // If no featured projects exist, use the first 3 projects instead
  const displayProjects = featuredProjects.length > 0 
    ? featuredProjects.slice(0, 3)
    : safeProjects.slice(0, 3);

  return (
    <section className="relative w-full overflow-hidden bg-[#0a1128]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-3 !h-3',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125'
          }}
          modules={[Autoplay, Pagination, EffectFade]}
          onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          className="!pb-8 min-h-[35vh]"
        >
          {displayProjects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center min-h-[35vh] py-6 lg:py-8">
                {/* Content Side */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: activeSlide === index ? 1 : 0, x: activeSlide === index ? 0 : -60 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white space-y-4 lg:pr-6"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium"
                  >
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    Featured Project
                  </motion.div>

                  {/* Category */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="inline-block bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {project.category?.name || project.category}
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                  >
                    <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                      {project.title}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-base lg:text-lg text-white/80 leading-relaxed max-w-lg"
                  >
                    {project.description}
                  </motion.p>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="flex flex-wrap gap-2"
                  >
                    {(project.tech_stack ? project.tech_stack.split(',').slice(0, 3) : []).map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm font-medium border border-white/20"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </motion.div>

                  {/* Mentor */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-2 text-white/70"
                  >
                    <AcademicCapIcon className="w-4 h-4" />
                    <span className="text-sm">Mentored by {project.technical_mentor}</span>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <button
                      onClick={() => router.push(`/projects/${project.id}`)}
                      className="group relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <CodeBracketIcon className="w-4 h-4" />
                        View Project
                        <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </motion.div>
                </motion.div>

                {/* Image Side */}
                <motion.div
                  initial={{ opacity: 0, x: 60, scale: 0.8 }}
                  animate={{ 
                    opacity: activeSlide === index ? 1 : 0, 
                    x: activeSlide === index ? 0 : 60,
                    scale: activeSlide === index ? 1 : 0.8
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-xl opacity-40 animate-pulse delay-1000"></div>
                  
                  {/* Main Image Container */}
                  <div className="relative group cursor-pointer" onClick={() => router.push(`/projects/${project.id}`)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-1 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={project.thumbnail_url || '/images/default-project.png'}
                        alt={project.title}
                        className="w-full h-[250px] lg:h-[280px] object-cover rounded-3xl shadow-2xl"
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        Student Project
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                        <div className="text-white text-center">
                          <RocketLaunchIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="font-semibold">View Project Details</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default ProjectsHero;
