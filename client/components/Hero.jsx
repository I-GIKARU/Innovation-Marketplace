'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/images/hero1.jpg', '/images/hero2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[70vh] sm:h-[80vh] md:h-[85vh] text-white flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="absolute inset-0 bg-black/50 z-10" />

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

      <div className="relative z-20 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-3 sm:mb-5 leading-tight px-2"
        >
          <span className="block sm:inline">Turn Your Capstone Project</span>{' '}
          <span className="block sm:inline">Into Your First Opportunity</span>
        </motion.h1>

       <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/90 max-w-4xl mx-auto mb-6 sm:mb-8 px-2 leading-relaxed"
        >
          <span className="block sm:inline">Build it. Launch it. Get hired. Get paid.</span>
          <br className="hidden sm:block" />
          <span className="block sm:inline mt-2 sm:mt-0">Your Moringa project deserves more than just a demo day.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
        >
          <motion.a
            href="/projects"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center inline-flex items-center justify-center gap-2"
          >
            <span>Explore Projects</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
