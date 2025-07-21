'use client';
import { motion } from 'framer-motion';

const merchItems = [
  {
    name: 'Moringa Hoodie',
    price: 'KES 2,000',
    image: '/images/hoody3.jpg',
    link: 'https://yourstore.com/hoodie',
  },
  {
    name: 'Branded Mug',
    price: 'KES 800',
    image: '/images/cup2.jpg',
    link: 'https://yourstore.com/mug',
  },
  {
    name: 'Brandded Notebook',
    price: 'KES 400',
    image: '/images/notebook3.jpg',
    link: 'https://yourstore.com/stickers',
  },
  {
    name: 'Branded Water Bottle',
    price: 'KES 1,200',
    image: '/images/waterbottle1.jpg',
    link: 'https://yourstore.com/bag',
  },
];

const MerchandiseGrid = () => {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Official Merch</h2>
      <p className="text-center text-gray-600 mb-12">
        Wear your journey. Support the community. Rep the code.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
        {merchItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg group"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300 z-10" />
            <div className="absolute bottom-0 left-0 w-full p-4 z-20 text-white bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-white/80 mb-2">{item.price}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black text-sm px-4 py-2 rounded hover:bg-yellow-400 transition"
              >
                Buy Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MerchandiseGrid;
