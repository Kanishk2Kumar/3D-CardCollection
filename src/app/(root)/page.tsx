import Navbar from "@/components/navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Collection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-w-full bg-red-50">
      <Navbar />
      <Hero />
      <Features />
      <div className="min-h-screen bg-black"></div>
      <Footer />
    </div>
  );
}
