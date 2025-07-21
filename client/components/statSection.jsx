'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useAnimation } from 'framer-motion';

// ✅ Counter component (must be before StatsSection)
const AnimatedCounter = ({ target }) => {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 10);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(counter);
      }
      setCount(Math.round(start));
    }, 10);

    return () => clearInterval(counter);
  }, [inView, target]);

  return (
    <span ref={ref}>{count.toLocaleString()}</span>
  );
};

// ✅ StatsSection
const StatsSection = () => {
  const stats = [
    { label: 'Projects Launched', target: 120 },
    { label: 'Students Participating', target: 950 },
    { label: 'Companies Browsing', target: 75 },
    { label: 'Merch Items Sold', target: 430 },
  ];

  return (
    <section className="py-8 bg-[#12213f] bg-opacity-90 text-center">
      <h2 className="text-3xl text-orange-600 md:text-4xl font-extrabold mb-4">Our Impact So Far</h2>
      <p className="text-white max-w-xl mx-auto mb-12">
        Proof that student innovation, industry collaboration, and community support are shaping the future — together.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto px-6">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#0a96c1] mb-2">
              <AnimatedCounter target={stat.target} />+
            </div>
            <p className="text-white text-lg">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
