import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fullUrl } from '../lib/utils';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState('/assets/products/hero-tv.png');

  return (
    <section className="relative w-full h-[60vh] overflow-hidden">
      {/* === MOBILE / TABLET: image centered  === */}
      <div className="absolute inset-0 lg:hidden z-0 flex items-start justify-center pt-8">
        <img
          src={bgImage}
          alt="Hero Background"
          className="w-[100%] h-[75%] object-contain filter drop-shadow-xl animate-[float_6s_ease-in-out_infinite]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10 pointer-events-none" />
      </div>

      {/* === DESKTOP: side-by-side layout === */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-end">
        {/* Left spacer for text */}
        <div className="absolute inset-0 w-[50%] bg-white" />

        {/* Right floating image */}
        <div className="relative w-[65%] h-[100%] mr-2 mt-8 flex items-center justify-center transform transition-all duration-700 hover:scale-[1.05] animate-[fadeIn_1s_ease-out]">
          <img
            src={bgImage}
            alt="Hero Features"
            className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-end sm:items-center container-custom pb-4 sm:pb-4 sm:pt-4">
        <div className="lg:max-w-xl md:max-w-2xl max-w-full animate-slide-up text-left">
          {/* Badge */}
          <span className="badge-yellow mb-2 inline-block">Premium Electronics</span>

          {/* Headline */}
          <h1 className="text-[24px] leading-[1.1] md:text-7xl font-display font-bold mb-4 text-[#DC143C] uppercase">
            SL SHOPEE
          </h1>

          <p className="text-base md:text-xl text-gray-600 mb-6 max-w-lg font-body leading-relaxed">
            Discover a wide range of premium electronic and electrical devices. High-quality products designed for your modern lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary flex items-center justify-center group"
            >
              Shop Now
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-4 sm:py-3 rounded-md font-medium text-sm border border-gray-400 text-gray-700 hover:bg-gray-50 transition-all shadow-sm text-center"
            >
              Explore Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
