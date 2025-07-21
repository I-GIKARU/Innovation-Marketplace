'use client';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const AboutSection = () => {
  return (
    <section className="py-20 bg-white text-gray-800">
      {/* Title */}
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold text-center mb-8"
      >
        More Than Just a Demo Day
      </motion.h2>

      {/* Blurb */}
      <motion.p
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        className="text-center max-w-2xl mx-auto text-lg text-gray-500 mb-12"
      >
        We’re building a launchpad where ideas from the classroom become real-world innovations.  
        A home for future startups, side-hustles, and standout portfolios — all born at Moringa.
      </motion.p>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 text-center">
        {[
          {
            icon: '🚀',
            title: 'Built by Students',
            text: 'All projects on our platform are made by real Moringa grads solving real problems — with creativity and code.',
          },
          {
            icon: '💼',
            title: 'Backed by Talent',
            text: 'From job-seekers to startup founders — each project reflects the hands-on skills recruiters are looking for.',
          },
          {
            icon: '🌐',
            title: 'Open to the World',
            text: 'Investors, employers, or just the curious — anyone can explore, connect, and support the next big thing.',
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i + 2}
          >
            <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 text-white rounded-full flex items-center justify-center text-2xl">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-500">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={5}
        className="text-center mt-12"
      >
        <a
          href="#projects"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-500 transition"
        >
          Discover Student Projects
        </a>
      </motion.div>
    </section>
  );
};

export default AboutSection;
