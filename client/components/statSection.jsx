'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ArrowTrendingUpIcon, UsersIcon, BuildingOfficeIcon, GiftIcon } from '@heroicons/react/24/outline';


const AnimatedCounter = ({ target }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2500;
    const steps = 100;
    const increment = target / steps;
    const stepTime = duration / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(counter);
      }
      setCount(Math.round(start));
    }, stepTime);

    return () => clearInterval(counter);
  }, [inView, target]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-block"
    >
      {count.toLocaleString()}
    </motion.span>
  );
};


const StatsSection = () => {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, threshold: 0.2 });

  const stats = [
    { 
      label: 'Projects Launched', 
      target: 120, 
      icon: ArrowTrendingUpIcon,
      description: 'Student innovations'
    },
    { 
      label: 'Students Participating', 
      target: 950, 
      icon: UsersIcon,
      description: 'Active creators'
    },
    { 
      label: 'Companies Browsing', 
      target: 75, 
      icon: BuildingOfficeIcon,
      description: 'Industry partners'
    },
    { 
      label: 'Merch Items Sold', 
      target: 430, 
      icon: GiftIcon,
      description: 'Community support'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Our Impact
            </span>
            <span className="text-white block mt-2">So Far</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Proof that student innovation, industry collaboration, and community support are shaping the future — together.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="group relative"
              >
                {/* Card background with gradient border */}
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-shadow duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Counter */}
                  <div className="relative mb-4">
                    <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter target={stat.target} />+
                    </div>
                    <div className="text-lg font-semibold text-orange-400 mb-2">
                      {stat.label}
                    </div>
                    <div className="text-sm text-slate-400">
                      {stat.description}
                    </div>
                  </div>
                  
                  {/* Subtle animation line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
            <span>Growing every day</span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-slate-400 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
