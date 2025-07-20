'use client';

import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import { useMerchandise } from '@/hooks/useMerchandise';
import { useRouter } from 'next/navigation';

const Hero = () => {
    const router = useRouter();
    const { merchandise, loading, fetchMerchandise } = useMerchandise();

    useEffect(() => {
        fetchMerchandise({ perPage: 3 }); // Load top 3 items
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;
    if (!merchandise.length) return null;

    return (
        <div className="my-4 py-10 px-6">
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
            >
                {merchandise.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative">
                            <img
                                src={slide.image_url}
                                alt={slide.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-40 text-white p-4 w-full rounded-b-lg">
                                <h2 className="text-xl font-bold">{slide.name}</h2>
                                <p className="mb-2">KES {slide.price}</p>
                                <button
                                    onClick={() => router.push(`/e_commerce/product/${slide.id}`)}
                                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Hero;
