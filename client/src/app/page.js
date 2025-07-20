// app/page.jsx
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Explore from "@/components/Explore";
import Merchandise from "@/components/Merchandise"
import Project from "@/components/Project";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Explore />
      <Project/>
      <Merchandise />
      <HowItWorks />
      <Contact />
      <Footer />
    </>
  );
}
