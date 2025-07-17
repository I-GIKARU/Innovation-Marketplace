import React from 'react';
import Image from 'next/image';

const Explore = () => {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        
        <div className="flex justify-center">
          <Image src="/images/explore.jpg" alt="Explore Visual"width={500} height={400}className="rounded-lg shadow-xl"/>
        </div>

        <div className="bg-gray-100 rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <p className="text-gray-800 text-lg mb-4 text-center">
            Discover how we solve real world problems through code.From secure APIs to scalable dbs, beautifuly made user Interfaces, discover all here.
          </p>
          <Image
            src="/images/exlore.jpg" alt="people discusing project"width={400} height={300} className="rounded-lg mb-4" />
          <button className="mt-auto px-6 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-600 transition">
            Explore Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Explore;


