import React from 'react';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';

const steps = [
  {
    id: 1,
    title: 'Upload your project with a short description and demo link',
  },
  {
    id: 2,
    title: 'Get listed on the marketplace, ready for the world to see',
  },
  {
    id: 3,
    title: 'Attract buyers, recruiters, or potential co-founders',
  },
  {
    id: 4,
    title: 'Earn income, build your brand, and grow your career',
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">How It Works</h2>
        <p className="text-gray-500 mb-16 text-lg">Simple. Fast. Impactful.</p>

        <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center group relative">
              
          
              <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-xl font-bold text-orange-500 border border-gray-200
                group-hover:bg-orange-500 group-hover:text-white transition duration-300 ease-in-out">
                {step.id}
              </div>

            
              <p className="mt-4 max-w-[180px] text-gray-700 text-sm md:text-base font-medium">{step.title}</p>

              {index !== steps.length -1 && (
                <div className="hidden md:block absolute top-7 right-[-50px] text-orange-400 group-hover:text-orange-500 transition-transform duration-300 ease-in-out">
                  <HiOutlineArrowNarrowRight size={40} className="transform group-hover:translate-x-2"/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
