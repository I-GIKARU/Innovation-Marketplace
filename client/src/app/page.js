// app/page.js
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Explore from "@/components/Explore";
import Projects from "@/components/Project";
import Merchandise from "@/components/Merchandise"

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Explore />
      <Projects/>
      <Merchandise />
      <HowItWorks />
      <Contact />
      <Footer />
    </>
  );
}
