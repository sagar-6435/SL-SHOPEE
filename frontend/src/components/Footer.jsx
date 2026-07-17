import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Share2, Globe } from 'lucide-react';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 mb-12 items-start">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex flex-col gap-2 group">
              <span className="text-[28px] font-display font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                SL SHOPEE
              </span>
              <p className="text-[10px] font-body font-bold text-gray-300 uppercase tracking-[0.3em]">
                PRESERVING YOUR MOMENTS
              </p>
            </Link>
            <p className="font-body text-gray-400 text-sm leading-relaxed italic">
              Preserving your most cherished moments through digital artistry and premium craftsmanship.
            </p>
          </div>

          {/* Curated Studio */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-body font-bold text-gray-900 uppercase tracking-[0.3em]">
              CURATED STUDIO
            </h4>
            <ul className="space-y-0">
              <li><Link to="/services" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Gallery</Link></li>
              <li><Link to="/shop" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-body font-bold text-gray-900 uppercase tracking-[0.3em]">
              SUPPORT
            </h4>
            <ul className="space-y-0">
              <li><Link to="/shipping-info" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Shipping Info</Link></li>
              <li><Link to="/about" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-xs font-body font-bold text-gray-400 uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Map */}
          <div className="flex items-start justify-start lg:justify-end">
            <div className="rounded-[8px] overflow-hidden border border-gray-100 shadow-sm mr-0 lg:mr-4" style={{ width: 306, height: 172 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d952.4117781428866!2d81.52284926957388!3d16.544234814703773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d30a6f6646ab%3A0x349161fbbf6c561d!2sSL SHOPEE%20digital%20world!5e0!3m2!1sen!2sin!4v1747568400000!5m2!1sen!2sin"
                width="306"
                height="172"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>



        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-gray-400 font-body font-bold tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} SL SHOPEE. Crafted with sentiment.
          </p>

          <div className="flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="text-gray-300 hover:text-gray-900 transition-colors">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-500 font-body tracking-[0.15em]">
            Designed &amp; Developed by <span className="font-bold text-gray-700 text-sm">Webgenixx ❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


