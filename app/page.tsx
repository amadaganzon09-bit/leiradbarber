import TrimmerScroll from "@/components/TrimmerScroll";
import Header from "@/components/Header";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Newsletter from "@/components/Newsletter";
import BackgroundCanvas from "@/components/ui/BackgroundCanvas";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505]">
      <BackgroundCanvas />
      <Header />
      <TrimmerScroll />
      <Services />
      <Gallery />
      <About />
      <Stats />
      <Team />
      <Newsletter />
      <Footer />
    </main>
  );
}
