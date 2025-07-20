'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';

const Hero = () => {
    const slides = [
        { id: 1, image: '/images/hoodie.png', name: 'Hoodies', price: 'KES 1320' },
        { id: 2, image: '/images/Notebook.png', name: 'Notebook', price: 'KES 2850' },
        { id: 3, image: '/images/cup.png', name: 'cup', price: 'KES 1200' },
    ];
     return (
    <div className="my-4 py-10 px-6">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, Pagination]}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute bottom-0 left-0 bg-transparent bg-opacity-50 text-white p-4 w-full rounded-b-lg">
                <h2 className="text-xl font-bold">{slide.name}</h2>
                <p className="mb-2">{slide.price}</p>
                <button className="bg-green-600 px-4 py-2 rounded">Buy Now</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;