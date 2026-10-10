/**
 * Halaman utama landing page — komposisi 8 section sesuai urutan PRD §3:
 * Hero → About → Menu → Best Seller → Promo → Lokasi → Banner FamiGo → Footer.
 */
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Menu from "../components/sections/Menu";
import BestSeller from "../components/sections/BestSeller";
import PromoSection from "../components/sections/Promo";
import Location from "../components/sections/Location";
import FamiGoBanner from "../components/sections/FamiGoBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <BestSeller />
        <PromoSection />
        <Location />
        <FamiGoBanner />
      </main>
      <Footer />
    </>
  );
}
