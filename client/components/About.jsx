'use client';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 1) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const AboutSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-orange-50 text-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <motion.div
          variants={slideInFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight"
          >
            More Than Just a Demo Day
          </motion.h2>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-8 rounded-full"
            variants={scaleIn}
            custom={1}
          ></motion.div>
          
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-center max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed font-light px-6"
          >
            We're building a launchpad where ideas from the classroom become real-world innovations.  
            A home for future startups, side-hustles, and standout portfolios — all born at Moringa.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto px-6">
          {[
            {
              icon: '🚀',
              title: 'Built by Students',
              text: 'All projects on our platform are made by real Moringa grads solving real problems — with creativity and code.',
              gradient: 'from-orange-400 to-red-500',
              bgGradient: 'from-orange-50 to-red-50',
            },
            {
              icon: '💼',
              title: 'Backed by Talent',
              text: 'From job-seekers to startup founders — each project reflects the hands-on skills recruiters are looking for.',
              gradient: 'from-blue-400 to-purple-500',
              bgGradient: 'from-blue-50 to-purple-50',
            },
            {
              icon: '🌐',
              title: 'Open to the World',
              text: 'Investors, employers, or just the curious — anyone can explore, connect, and support the next big thing.',
              gradient: 'from-green-400 to-teal-500',
              bgGradient: 'from-green-50 to-teal-50',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i + 3}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`relative group cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-3xl transform group-hover:scale-105 transition-transform duration-300 opacity-70`}></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center">
                <motion.div 
                  className={`mx-auto mb-6 w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.text}
                </p>
                
                {/* Hover effect decoration */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={6}
          className="text-center mt-16"
        >
          <motion.a
            href="#projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Discover Student Projects</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              layoutId="button-bg"
            ></motion.div>
            <motion.span
              className="ml-2 text-xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
