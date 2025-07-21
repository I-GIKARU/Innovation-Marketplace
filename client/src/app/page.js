// app/page.jsx
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import StatsSection from "@/components/statSection";
import AboutSection from "@/components/About";
import Merchandise from "@/components/Merchandise"
import FeaturedProjects from "@/components/Project";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <AboutSection />
      <FeaturedProjects/>
      <StatsSection />
      <Merchandise />
      <Footer />
    </>
  );
}
