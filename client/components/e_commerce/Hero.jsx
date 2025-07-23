'use client';

import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useMerchandise } from '@/hooks/useMerchandise';
import { useRouter } from 'next/navigation';

import 'swiper/css';
import 'swiper/css/pagination';

const Hero = () => {
  const router = useRouter();
  const { merchandise, loading, fetchMerchandise } = useMerchandise();

  useEffect(() => {
    fetchMerchandise({ perPage: 3 }); // Load top 3 items
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!merchandise.length) return null;

  return (
    <section className="relative w-full px-4 md:px-10 py-12">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
        className="rounded-xl shadow-xl overflow-hidden"
      >
        {merchandise.map((slide) => (
          <SwiperSlide key={slide.id}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src={
                  slide.image_url ||
                  JSON.parse(slide.image_urls || '[]')[0] ||
                  '/images/default.png'
                }
                alt={slide.name}
                className="w-full h-[450px] md:h-[550px] object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white z-10">
                <h2 className="text-2xl md:text-4xl font-extrabold mb-2">
                  {slide.name}
                </h2>
                <p className="text-lg mb-4">KES {slide.price}</p>

                <button
                  onClick={() => router.push(`/e_commerce/product/${slide.id}`)}
                  className="bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-yellow-400 transition-colors duration-300"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
