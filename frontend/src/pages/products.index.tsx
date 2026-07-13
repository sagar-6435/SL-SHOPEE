import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Filter, Heart } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/site-data";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      category: search.category as string || "All",
    }
  },
  head: () => ({
    meta: [
      { title: "Products — SL SHOPEE" },
      { name: "description", content: "Browse TVs, mobiles, furniture, ACs, washing machines and kitchen appliances at SL SHOPEE." },
      { property: "og:title", content: "Products — SL SHOPEE" },
      { property: "og:description", content: "Full catalog of electronics and home furniture from trusted brands." },
    ],
  }),
  component: ProductsPage,
});

export function ProductsPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const [active, setActive] = useState<string>(category);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [priceLimit, setPriceLimit] = useState(250000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    if (category) setActive(category);
  }, [category]);

  const cats = ["All", ...CATEGORIES.map((c) => c.name)];
  const brandsList = useMemo(() => Array.from(new Set(PRODUCTS.map((p) => p.brand))), []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (active !== "All" && p.category !== active) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      const productPrice = parseInt(p.price.replace(/[^\d]/g, ''), 10);
      if (productPrice > priceLimit) return false;
      return true;
    });
  }, [active, selectedBrands, priceLimit]);

  useEffect(() => {
    const loadCart = () => setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!existing.find((p: any) => p.name === product.name)) {
      existing.push({ ...product, qty: 1 });
      localStorage.setItem('cart', JSON.stringify(existing));
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const existing = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!existing.find((p: any) => p.name === product.name)) {
      existing.push(product);
      localStorage.setItem('wishlist', JSON.stringify(existing));
      window.dispatchEvent(new Event('wishlist-updated'));
    }
  };
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:pt-32 sm:px-6 lg:px-8">

      <div className="mt-6 sm:mt-10 flex justify-end">
        <button type="button" onClick={() => setShowFilters((c) => !c)} aria-expanded={showFilters} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand">
          <Filter className="h-4 w-4 text-brand" />
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden mt-4">
          <aside className="bg-white p-5 rounded-2xl border border-border/60 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wide"><Filter className="h-4 w-4 text-brand" /> Categories</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <button key={c} onClick={() => setActive(c)} className={`rounded-full px-3 py-1.5 text-sm transition-all ${active === c ? "bg-brand text-brand-foreground font-semibold" : "border border-border text-foreground/70 hover:border-brand hover:text-brand"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="border-t border-border/60 pt-4">
              <div className="flex items-center justify-between text-sm font-bold text-foreground uppercase tracking-wide mb-3">
                Price <span className="text-brand font-display font-bold">₹{priceLimit.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="1000" max="250000" step="1000" value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} className="w-full accent-brand cursor-pointer" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-medium">
                <span>₹1,000</span><span>₹2,50,000+</span>
              </div>
            </div>
            <div className="border-t border-border/60 pt-4">
              <div className="text-sm font-bold text-foreground uppercase tracking-wide mb-3">Brands</div>
              <div className="flex flex-wrap gap-2">
                {brandsList.map(b => (
                  <button key={b} onClick={() => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${selectedBrands.includes(b) ? 'bg-brand text-white' : 'border border-border text-foreground/70 hover:border-brand hover:text-brand'}`}>{b}</button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className={`mt-6 sm:mt-8 grid gap-8 ${showFilters ? "lg:grid-cols-[220px_1fr]" : "lg:grid-cols-1"}`}>
        {showFilters ? (
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start bg-white p-5 rounded-2xl border border-border/60 shadow-sm space-y-8 h-max">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wide"><Filter className="h-4 w-4 text-brand" /> Categories</div>
              <div className="mt-4 flex flex-col gap-1.5">
                {cats.map((c) => (
                  <button key={c} onClick={() => setActive(c)} className={`rounded-xl px-4 py-2 text-left text-sm transition-all ${active === c ? "bg-brand text-brand-foreground font-semibold" : "text-foreground/70 hover:bg-brand/5 hover:text-brand"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center justify-between text-sm font-bold text-foreground uppercase tracking-wide mb-4">
                Price
                <span className="text-brand font-display font-bold">₹{priceLimit.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground font-medium">
                <span>₹1,000</span>
                <span>₹2,50,000+</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wide mb-4">Brands</div>
              <div className="flex flex-col gap-2">
                {brandsList.map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(b) ? 'bg-brand border-brand' : 'border-border/80 group-hover:border-brand'}`}>
                      {selectedBrands.includes(b) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedBrands.includes(b)} onChange={() => {
                      setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                    }} />
                    <span className={`text-sm ${selectedBrands.includes(b) ? 'font-semibold text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>{b}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="font-display text-2xl font-bold">No Products Found</h3>
              <p className="mt-2 text-muted-foreground">We couldn't find anything in this category right now.</p>
              <button
                onClick={() => setActive("All")}
                className="mt-6 rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-brand-glow transition-transform hover:scale-105"
              >
                Clear Filter
              </button>
            </div>
          ) : filtered.map((p, i) => (
            <motion.div key={p.name} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -6 }} className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-elevated">
              <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }} className="group relative h-44 block overflow-hidden bg-[oklch(0.98_0.01_27)] p-3">
                <img src={p.image} alt={p.name} width={1280} height={1280} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">{p.brand}</span>
                <button
                  onClick={(e) => handleAddToWishlist(e, p)}
                  className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-muted-foreground shadow-sm hover:text-brand hover:scale-105 transition-all z-10 block"
                  title="Add to Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </Link>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }}>
                  <h3 className="mt-1 font-display font-semibold hover:text-brand transition-colors">{p.name}</h3>
                </Link>
                <div className="mt-2 text-brand font-display text-lg font-bold">{p.price}</div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate({ to: '/checkout', search: { product: p.name.toLowerCase().replace(/ /g, '-') } })} type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
                    Buy Now
                  </button>
                  {cart.find((item: any) => item.name === p.name) ? (
                    <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand bg-brand/5 px-4 py-2.5 text-sm font-semibold text-brand transition-colors cursor-default">
                      <ShoppingCart className="h-4 w-4" /> Added
                    </button>
                  ) : (
                    <button onClick={(e) => handleAddToCart(e, p)} type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-brand/5">
                      <ShoppingCart className="h-4 w-4" /> Add
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <WhatsAppFab />
    </div>
  );
}
