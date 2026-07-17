import HeroBanner from '../components/HeroBanner';
import FlashRibbon from '../components/FlashRibbon';
import ShopByOccasionSection from '../components/ShopByOccasionSection';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <HeroBanner />
      <FlashRibbon />
      <ShopByOccasionSection />
      <Testimonials />
    </div>
  );
};

export default HomePage;
