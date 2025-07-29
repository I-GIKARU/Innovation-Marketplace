'use client';
import { motion } from 'framer-motion';
import { RiGraduationCapLine, RiBuilding2Line, RiShieldUserLine } from 'react-icons/ri';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i = 1) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const UserTypesSection = () => {
  const userTypes = [
    {
      icon: RiGraduationCapLine,
      title: 'Students',
      description: 'Showcase your projects, get feedback, and connect with clients',
      features: ['Upload projects', 'Receive contributions', 'Portfolio building', 'Peer collaboration'],
      emailRequirement: 'Use your @student.moringaschool.com email',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    {
      icon: RiBuilding2Line,
      title: 'Clients',
      description: 'Discover talented developers and fund innovative projects',
      features: ['Browse projects', 'Support developers', 'Place orders', 'Hire talent'],
      emailRequirement: 'Use any personal Gmail account',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: RiShieldUserLine,
      title: 'Platform Admin',
      description: 'Manage the platform, review projects, and oversee operations',
      features: ['Review submissions', 'Manage users', 'Platform oversight', 'Content moderation'],
      emailRequirement: 'Special admin credentials required',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-clip-text text-transparent mb-5">
            Join as Student or Client
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're a student looking to showcase your work or a client seeking talented developers, 
            we have the perfect platform for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {userTypes.map((userType, index) => (
            <motion.div
              key={userType.title}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index + 1}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className="relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${userType.bgColor} rounded-3xl transform group-hover:scale-105 transition-transform duration-300 opacity-70`}></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Icon */}
                <div className={`mx-auto mb-6 w-16 h-16 bg-gradient-to-br ${userType.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                  <userType.icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center group-hover:text-gray-900 transition-colors duration-300">
                  {userType.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {userType.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {userType.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${userType.color.includes('green') ? 'bg-green-400' : userType.color.includes('blue') ? 'bg-blue-400' : 'bg-purple-400'} mr-3 flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Email requirement */}
                <div className={`p-3 rounded-lg bg-gradient-to-r ${userType.bgColor} border-l-4 border-gradient-to-b ${userType.color}`}>
                  <p className="text-xs font-medium text-gray-700">
                    📧 {userType.emailRequirement}
                  </p>
                </div>
                
                {/* Hover effect decoration */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${userType.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-3xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl p-6 border border-blue-200/30 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Click the <span className="font-semibold text-orange-600">"Login"</span> button in the navigation bar to begin your journey. 
              You'll be automatically assigned the right role based on your email address!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Students → @student.moringaschool.com</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Clients → Any Gmail account</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UserTypesSection;
