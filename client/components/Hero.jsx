'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/images/hero1.jpg', '/images/hero2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000); // change image every 7 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] text-white flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Background with motion zoom-out */}
      <div className="absolute inset-0 z-0 h-full w-full">
        {images.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentImage === index ? 1 : 0,
              scale: currentImage === index ? 1 : 1.1,
            }}
            transition={{ duration: 6.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight"
        >
          Turn Your Capstone Project  
          Into Your First Opportunity
        </motion.h1>

       <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg font-light text-white/80 max-w-4xl mx-auto mb-6 px-4 md:px-0"
        >
          Build it. Launch it. Get hired. Get paid.
          <br className="block sm:hidden" />
          Your Moringa project deserves more than just a demo day.
        </motion.p>


        <a
          href="#/projects"
          className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-400 transition"
        >
          Explore Projects
        </a>

      </div>
    </section>
  );
};

export default Hero;
