import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-gradient-to-t from-[#e65e4e] to-[#f5f5f5] py-24 px-10 flex flex-col-reverse md:flex-row items-center justify-between">
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Turn Your Capstone Project Into Your First Opportunity
        </h1>
        <p className="text-gray-700 mb-6">
          Build it. Launch it. Get hired. Get paid. <br />
          Your Moringa project deserves more than just a demo day.
        </p>
        <Link href="/explore">
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-medium">
            Explore projects
          </button>
        </Link>
      </div>
      <div className="relative w-full max-w-md h-[300px] mb-10 md:mb-0">
        {/* <Image
          src="/images/hero-graphic.png" 
          alt="Hero Graphic"
          layout="fill"
          objectFit="contain"
        /> */}
      </div>
    </section>
  );
};

export default Hero;
