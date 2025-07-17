import Image from "next/image";
import Link from "next/link";
import { HiArrowNarrowRight } from "react-icons/hi";

const Hero = () => {
  return (
    <section
      className="bg-gradient-to-t from-[#e65e4e] to-[#f5f5f5] py-24 px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between"
      style={{ borderBottomLeftRadius: "50px", borderBottomRightRadius: "50px" }}
    >
      <div className="w-full md:w-1/2 max-w-lg text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Turn Your Capstone Project Into Your First Opportunity
        </h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg">
          Build it. Launch it. Get hired. Get paid. <br />
          Your Moringa project deserves more than just a demo day.
        </p>
        <Link href="/explore" passHref>
          <button className="inline-flex items-center bg-orange-400 hover:bg-orange-500 transition-colors duration-300 text-white px-6 py-3 rounded-full font-medium shadow-md">
            Explore Projects
            <HiArrowNarrowRight className="ml-2 w-5 h-5" />
          </button>
        </Link>
      </div>

      <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          <Image
            src="/images/hero.png"
            alt="Illustration showcasing capstone projects"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
