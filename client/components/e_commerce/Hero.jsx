'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';
import { ShoppingBagIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Hero = ({ onProductClick }) => {
  const { merchandise, loading, fetchMerchandise } = useMerchandise();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    fetchMerchandise({ perPage: 3 }); // Load top 3 items
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[25vh] bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (!merchandise.length) return null;

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
          {merchandise.map((slide, index) => (
            <SwiperSlide key={slide.id}>
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
                    Featured Product
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
                  >
                    <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                      {slide.name}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-base lg:text-lg text-white/80 leading-relaxed max-w-lg"
                  >
                    Discover premium quality and exceptional design. Transform your space with our carefully curated collection.
                  </motion.p>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-baseline gap-2"
                  >
                    <span className="text-xl lg:text-2xl font-bold text-white">
                      KES {slide.price?.toLocaleString()}
                    </span>
                    <span className="text-white/60 line-through text-sm">
                      KES {Math.round(slide.price * 1.3)?.toLocaleString()}
                    </span>
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <button
                      onClick={() => onProductClick?.(slide)}
                      className="group relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <ShoppingBagIcon className="w-4 h-4" />
                        Shop Now
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
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-1 group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={
                          slide.image_url ||
                          JSON.parse(slide.image_urls || '[]')[0] ||
                          '/images/default.png'
                        }
                        alt={slide.name}
                        className="w-full h-[250px] lg:h-[280px] object-cover rounded-3xl shadow-2xl"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                        Best Seller
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

export default Hero;
