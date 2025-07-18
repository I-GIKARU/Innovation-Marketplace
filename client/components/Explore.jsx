import React from 'react';
import Image from 'next/image';

const Explore = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div className="flex justify-center">
          <Image src="/images/explore.jpg" alt="Explore Visual" width={500} height={400}
            className="rounded-lg shadow-xl w-full max-w-md sm:max-w-full h-auto object-cover"/>
        </div>
         
        <div className="flex flex-col gap-6">
          <div className="border border-orange-200 rounded-2xl shadow-md p-6 sm:p-10 flex flex-col justify-between">
            <p className="text-gray-800 text-md text-center leading-relaxed">
              Every year, Moringa students create brilliant software projects — built with real problems in mind.
              But after demo day, those projects often disappear.
              No users, no feedback, no income, no job offers.
              The result? Missed chances for innovation, growth, and impact. We’re here to change that.
            </p>
            <button className="mt-4 bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium self-center w-full sm:w-auto">
              Explore Now
            </button>
          </div>

          <div className="flex justify-center">
            <Image src="/images/exlore.jpg"  alt="people discussing project" width={600} height={300}
            className="rounded-lg shadow w-full max-w-lg h-auto object-cover"/>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Explore;
