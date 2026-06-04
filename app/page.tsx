import HeroSection from "@/src/components/Pages/Home_Page/HeroSection";
import ChangeSection from "@/src/components/Pages/Home_Page/ChangeSection";
import TruthSection from "@/src/components/Pages/Home_Page/TruthSection";
import TranslationSection from "@/src/components/Pages/Home_Page/TranslationSection";
import AboutWitySection from "@/src/components/Pages/Home_Page/AboutWitySection";
import FaqSection from "@/src/components/Pages/Home_Page/FaqSection";
import ProductSection from "@/src/components/Pages/Home_Page/ProductSection";
import Footer from "@/src/components/common/Footer";

export default function HomePage() {
   return (
    <>
      <HeroSection />
      <ChangeSection />
      <TruthSection />
      <TranslationSection />
      <AboutWitySection />
      <FaqSection />
      <ProductSection />
      <Footer />
    </>
  )
}
