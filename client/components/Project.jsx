'use client';
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

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
const projects = [
  {
    title: 'SafeFundi',
    description: 'AI-powered platform for construction site safety and emergency alerts.',
    tags: ['React', 'Tailwind', 'Flask'],
    image: '/images/foodcourt.jpg',
    github: 'https://github.com/devshel/safefundi',
    author: {
      name: 'Kim Dan',
      avatar: '/images/profile.jpg',
    },
  },
  {
    title: 'HealthHub',
    description: 'Clinic discovery and booking app for nearby health services.',
    tags: ['Next.js', 'MongoDB', 'Mapbox'],
    image: '/images/healthhub.jpg',
    github: 'https://github.com/devshel/healthhub',
    author: {
      name: 'Aisha Mwangi',
      avatar: '/images/profile.jpg',
    },
  },
  {
    title: 'GigSpace',
    description: 'Freelance marketplace for blue-collar workers in Kenya.',
    tags: ['Node.js', 'PostgreSQL', 'React'],
    image: '/images/tours.jpg',
    github: 'https://github.com/devshel/gigspace',
    author: {
      name: 'Kevin Otieno',
      avatar: '/images/profile.jpg',
    },
  },
  {
    title: 'EduTrack',
    description: 'Classroom analytics tool to monitor attendance and engagement.',
    tags: ['Django', 'Chart.js', 'Bootstrap'],
    image: '/images/explore.jpg',
    github: 'https://github.com/devshel/edutrack',
    author: {
      name: 'Mercy Wanjiku',
      avatar: '/images/profile.jpg',
    },
  },
];

const FeaturedProjects = () => {
  return (
    <section className="py-20 bg-gray-50">
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold text-center mb-8"
      >
        Featured <span className="text-orange-500">Projects</span>
      </motion.h2>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={1}
        className="text-center max-w-2xl mx-auto text-lg text-gray-500 mb-12"
      >
        Real-world solutions from the next generation of tech talent.
      </motion.p>

      <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto px-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i + 2}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
          >

            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />


            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition"
                >
                  <FaGithub size={20} />
                </a>
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={project.author.avatar}
                  alt={project.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700">{project.author.name}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

  
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={6}
        className="text-center mt-12"
      >
        <a
          href="/projects"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-500 transition"
        >
          Explore All Projects
        </a>
      </motion.div>
    </section>
  );
};

export default FeaturedProjects;
