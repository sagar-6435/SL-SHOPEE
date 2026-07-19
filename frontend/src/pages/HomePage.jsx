import HeroBanner from '../components/HeroBanner';
import FlashRibbon from '../components/FlashRibbon';
import ShopByOccasionSection from '../components/ShopByOccasionSection';
import Testimonials from '../components/Testimonials';
import FeaturedCategoriesProducts from '../components/FeaturedCategoriesProducts';
import DealsSection from '../components/DealsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <HeroBanner />
      <DealsSection />
      <FeaturedCategoriesProducts />
      <ShopByOccasionSection />
      <FlashRibbon />
      <Testimonials />
    </div>
  );
};

export default HomePage;
