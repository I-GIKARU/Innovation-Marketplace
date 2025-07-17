// app/page.js
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import Explore from "@/components/Explore";

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <Explore />
      <HowItWorks />
      <Contact />
      <Footer />
    </>
  );
}
