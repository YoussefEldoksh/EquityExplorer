import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import ToolsSection from '../components/ToolsSection';
import Footer from '../components/Footer';
import InvestSuggestions from '../components/InvestSuggestions';
function HomePage() {
  return (
    <>
      <Navbar isOtherPage={false} />
      <HeroSection />
      <FeaturesSection />
      <ToolsSection />
      <InvestSuggestions />
      <Footer />
    </>
  );
}

export default HomePage;
