// app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import StatsSection from "@/components/statSection";
import AboutSection from "@/components/About";
import Merchandise from "@/components/Merchandise"
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import UserTypesSection from "@/components/UserTypesSection";
import CombinedAuth from "@/components/auth/CombinedAuth";

// Modern Loading Component
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 z-50 bg-gradient-to-br from-orange-50 to-white flex items-center justify-center"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full"
      />
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-800 mb-2"
      >
        Loading Innovation
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600"
      >
        Preparing amazing content...
      </motion.p>
    </div>
  </motion.div>
);

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState({
    hero: false,
    about: false,
    userTypes: false,
    projects: false,
    stats: false,
    merchandise: false
  });

  useEffect(() => {
    // Simulate component loading with staggered timing
    const loadComponents = async () => {
      const components = Object.keys(componentsLoaded);
      
      for (let i = 0; i < components.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setComponentsLoaded(prev => ({ ...prev, [components[i]]: true }));
      }
      
      // Final delay before showing content
      await new Promise(resolve => setTimeout(resolve, 300));
      setLoading(false);
    };

    loadComponents();
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      
      {!loading && (
        <PageWrapper>
          <NavBar onShowAuth={() => setShowAuth(true)} />
          
          {/* Staggered component loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.hero ? 1 : 0, y: componentsLoaded.hero ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Hero />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.about ? 1 : 0, y: componentsLoaded.about ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AboutSection />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.userTypes ? 1 : 0, y: componentsLoaded.userTypes ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <UserTypesSection />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.projects ? 1 : 0, y: componentsLoaded.projects ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FeaturedProjects />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.stats ? 1 : 0, y: componentsLoaded.stats ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StatsSection />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: componentsLoaded.merchandise ? 1 : 0, y: componentsLoaded.merchandise ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Merchandise />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Footer />
          </motion.div>

        {/* Auth Overlay */}
        <AnimatePresence>
          {showAuth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={() => setShowAuth(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
              
              {/* Auth Modal */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <CombinedAuth onClose={() => setShowAuth(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </PageWrapper>
      )}
    </>
  );
}
