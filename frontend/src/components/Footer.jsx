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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 mb-12 items-start">
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


