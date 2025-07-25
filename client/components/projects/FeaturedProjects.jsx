'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaRocket, FaLightbulb } from 'react-icons/fa';
import { HiStar, HiEye, HiUsers, HiCode, HiSparkles, HiCubeTransparent, HiLightningBolt } from 'react-icons/hi';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Modern loading skeleton
const ProjectSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Modern project card
const ProjectCard = ({ project, index }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const imageSrc = project.thumbnail_url || '/placeholder.jpg';
  const techStack = project.tech_stack ? project.tech_stack.split(',').slice(0, 3) : [];
  const author = project.user_projects?.[0]?.user;
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        variants={cardHoverVariants}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
      >
        {/* Image Section with Overlay */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            src={imageError ? '/placeholder.jpg' : imageSrc}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {project.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
            >
              <HiSparkles className="w-3 h-3" />
              Featured
            </motion.div>
          )}
          
          {/* Stats Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 flex flex-col gap-2"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium">
                  <HiEye className="w-3 h-3 text-gray-600" />
                  <span>{project.views || 0}</span>
                </div>
                {project.user_projects && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-xs font-medium">
                    <HiUsers className="w-3 h-3 text-gray-600" />
                    <span>{project.user_projects.length}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          

        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Category */}
          {project.category && (
            <div className="mb-3">
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-full">
                {project.category.name || project.category}
              </span>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech, techIndex) => (
                <span
                  key={techIndex}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1"
                >
                  <HiCode className="w-3 h-3" />
                  {tech.trim()}
                </span>
              ))}
              {project.tech_stack && project.tech_stack.split(',').length > 3 && (
                <span className="text-gray-500 text-xs self-center font-medium">
                  +{project.tech_stack.split(',').length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Author Info */}
          {author && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {author.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {author.email?.split('@')[0] || 'Student'}
                </p>
                <p className="text-xs text-gray-500">Project Creator</p>
              </div>
            </div>
          )}
        </div>
        
        {/* View Project Button */}
        <div className="px-6 pb-6">
          <Link
            href={`/projects/${project.id}`}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          >
            <HiEye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            View Project
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturedProjects = () => {
  const { projects, fetchProjects, loading, error } = useProjects();
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    fetchProjects({ featured: true, per_page: 6 });
  }, [fetchProjects]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setDisplayProjects(projects.slice(0, 6));
    }
  }, [projects]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl transform -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-100/20 to-transparent rounded-full blur-3xl transform translate-x-32 translate-y-32" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20 relative"
        >
          {/* Floating Background Elements */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -8, 0],
              scale: [1, 0.95, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-10 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-5 left-1/4 w-16 h-16 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-xl"
          />

          {/* Badge with enhanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              stiffness: 400,
              damping: 15
            }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200/50 text-orange-700 px-6 py-3 rounded-full text-sm font-bold mb-8 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-default group"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <HiSparkles className="w-4 h-4" />
            </motion.div>
            <span className="uppercase tracking-wider font-extrabold">Featured Projects</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <HiLightningBolt className="w-4 h-4 text-orange-600" />
            </motion.div>
          </motion.div>
          
          {/* Main Heading with Staggered Animation */}
          <motion.div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-8 relative"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: '0.9'
              }}
            >
              <span className="block mb-2">Innovative</span>
              <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 bg-clip-text text-transparent relative">
                Solutions
                <motion.div
                  animate={{ 
                    scaleX: [0, 1, 1, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.3, 0.7, 1]
                  }}
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full origin-left"
                  style={{ width: '100%' }}
                />
              </span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                viewport={{ once: true }}
                className="block text-4xl md:text-5xl lg:text-6xl font-light text-gray-600 mt-4"
                style={{ letterSpacing: '0.02em' }}
              >
                from Tomorrow's <em className="not-italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">Developers</em>
              </motion.span>
            </motion.h2>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -top-8 -right-8 text-6xl"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                💡
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-4 -left-6 text-4xl"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                🚀
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-50/50 to-transparent rounded-2xl blur-xl" />
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed relative px-8 py-6 backdrop-blur-sm">
              Discover <strong className="font-bold text-gray-900">remarkable projects</strong> built by talented students at 
              <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent font-bold">Moringa School</span>.
              <br className="hidden md:block" />
              Each project represents <em className="not-italic text-blue-600 font-semibold">innovation</em>, 
              <em className="not-italic text-purple-600 font-semibold">creativity</em>, and 
              <em className="not-italic text-green-600 font-semibold">real-world problem-solving</em> skills.
            </p>
          </motion.div>

          {/* Interactive Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { icon: HiCubeTransparent, label: 'Innovative', count: '50+', color: 'from-blue-500 to-cyan-500' },
              { icon: FaRocket, label: 'Projects', count: '100+', color: 'from-orange-500 to-red-500' },
              { icon: FaLightbulb, label: 'Ideas', count: '∞', color: 'from-purple-500 to-pink-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-3 group-hover:shadow-lg transition-all duration-300`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Separator Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mt-12 origin-center"
          />
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Projects</h3>
              <p className="text-red-600 text-sm">Please check your connection and try again.</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && displayProjects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {displayProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && displayProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Featured Projects Yet</h3>
            <p className="text-gray-600 mb-6">Be the first to showcase your amazing work!</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              Browse All Projects
            </Link>
          </motion.div>
        )}

        {/* Call to Action */}
        {!loading && !error && displayProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
            >
              <span>Explore All Projects</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FaPlay className="w-4 h-4" />
              </motion.div>
            </Link>
            
            <p className="text-gray-500 text-sm mt-4">
              Discover {projects.length > 6 ? `${projects.length - 6} more` : 'more'} amazing projects
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
