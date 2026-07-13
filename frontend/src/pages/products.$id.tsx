import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { PRODUCTS } from '@/lib/site-data';
import { ShoppingCart, Star, Minus, Plus, Truck, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/products/$id')({
  component: ProductDetail,
});

export function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = () => setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  // Use the ID matched against lowercased dashed product names
  const product = PRODUCTS.find((p) => p.name.toLowerCase().replace(/ /g, '-') === id);

  if (!product) {
    return <div className="pt-32 min-h-screen text-center text-xl font-bold">Product not found.</div>;
  }

  const isAdded = cart.some((item: any) => item.name === product.name);
  const similarProducts = PRODUCTS.filter(p => p.category === product.category && p.name !== product.name).slice(0, 4);

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!existing.find((p: any) => p.name === product.name)) {
      existing.push({ ...product, qty });
      localStorage.setItem('cart', JSON.stringify(existing));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleAddToWishlist = () => {
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!existing.find((p: any) => p.name === product.name)) {
      existing.push(product);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };

  const handleBuyNow = () => {
    navigate({ to: '/checkout', search: { product: id } });
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex text-[11px] font-bold tracking-widest text-[#9FA3A9] uppercase mb-10">
          <Link to="/" className="hover:text-foreground">HOME</Link>
          <span className="mx-2">&gt;</span>
          <Link to="/products" className="hover:text-foreground">{product.category}</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Left: Image Container */}
          <div className="rounded-2xl border border-border/80 overflow-hidden relative shadow-sm h-[320px] sm:h-[420px] md:h-[480px] lg:h-[550px] flex items-center justify-center p-6 sm:p-8 bg-[oklch(0.98_0.005_260)]">
            <span className="absolute left-6 top-6 rounded-full bg-[#111827] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md z-10">
              Best Seller
            </span>
            <motion.img
              key={product.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col h-full pt-2 md:pt-4">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-foreground tracking-tight lowercase">{product.name}</h1>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-brand font-display text-3xl font-medium">{product.price}</span>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-border" />
                ))}
                <span className="text-[13px] font-semibold text-muted-foreground ml-1">(No reviews yet)</span>
              </div>
            </div>

            <p className="mt-8 text-foreground/70 leading-[1.8] text-[15px]">
              The perfect way to enhance your living space. Experience the best of {product.category.toLowerCase()} with the premium {product.name} by {product.brand}. Engineered for exceptional performance and longevity.
            </p>

            <div className="mt-10">
              <span className="text-[11px] font-bold tracking-widest text-[#9FA3A9] uppercase">Quantity</span>
              <div className="mt-3 flex items-center w-[120px] justify-between rounded-full bg-[#F4F5F7] px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[15px] font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 w-full">
              {isAdded ? (
                <button className="flex-1 min-w-[140px] inline-flex h-[54px] items-center justify-center gap-2 rounded-xl bg-brand/10 border border-brand text-[15px] font-bold text-brand transition-colors cursor-default">
                  <ShoppingCart className="h-4 w-4" /> Added to Cart
                </button>
              ) : (
                <button onClick={handleAddToCart} className="flex-1 min-w-[140px] inline-flex h-[54px] items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-bold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
              )}
              <button onClick={handleBuyNow} className="flex-1 min-w-[120px] max-w-[160px] h-[54px] rounded-xl bg-[#F6D050] text-[15px] font-bold text-[#111827] shadow-md transition-transform hover:scale-[1.02] hover:bg-[#F0C530]">
                Buy Now
              </button>
              <button onClick={handleAddToWishlist} className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-xl border border-border/80 bg-white hover:text-brand hover:border-brand/40 transition-colors shadow-sm shrink-0">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 flex gap-8 border-t border-border/60 pt-8">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#9FA3A9] uppercase">
                <Truck className="h-4 w-4 text-[#44B78B]" /> Ships in 2-3 Days
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#9FA3A9] uppercase">
                <ShieldCheck className="h-4 w-4 text-brand" /> Quality Guarantee
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground mb-8">Similar Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm hover:shadow-elevated transition-shadow"
                >
                  <Link to={`/products/$id`} params={{ id: p.name.toLowerCase().replace(/ /g, '-') }} className="group relative block h-40 overflow-hidden bg-[oklch(0.98_0.01_27)] p-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      width={1280}
                      height={1280}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.brand}</span>
                      <span className="text-brand font-display font-semibold">{p.price}</span>
                    </div>
                    <Link to={`/products/$id`} params={{ id: p.name.toLowerCase().replace(/ /g, '-') }}>
                      <h3 className="mt-2 text-sm font-semibold hover:text-brand transition-colors line-clamp-1">{p.name}</h3>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
