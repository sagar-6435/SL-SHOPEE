import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Trash2, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const Route = createFileRoute('/wishlist')({
  component: WishlistPage,
});

export function WishlistPage() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    };
    loadWishlist();
    window.addEventListener('wishlist-updated', loadWishlist);
    return () => window.removeEventListener('wishlist-updated', loadWishlist);
  }, []);

  const removeItem = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newWishlist = wishlist.filter((_, i) => i !== index);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const moveToCart = (e: React.MouseEvent, item: any, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push({ ...item, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(existingCart));
    window.dispatchEvent(new Event('cart-updated'));

    // Optionally remove from wishlist? Let's remove it to act as a "moving" action
    removeItem(e, index);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[oklch(0.98_0.005_260)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-white p-12 text-center shadow-sm">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand/10 text-brand mb-6">
              <Heart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your wishlist is empty</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">Save your favorite premium electronics and furniture for later by clicking the heart icon on any product.</p>
            <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-3.5 text-sm font-bold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-elevated"
              >
                <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }} className="group relative block h-48 overflow-hidden bg-[oklch(0.98_0.01_27)] p-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                    {p.brand}
                  </span>
                  <button
                    onClick={(e) => removeItem(e, i)}
                    className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-destructive shadow-sm hover:text-white hover:bg-destructive transition-all z-10 block"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Link>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                  <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }}>
                    <h3 className="mt-1 font-display font-semibold hover:text-brand transition-colors text-ellipsis whitespace-nowrap overflow-hidden">{p.name}</h3>
                  </Link>
                  <div className="mt-2 text-brand font-display text-lg font-bold">{p.price}</div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={(e) => moveToCart(e, p, i)} type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-brand/5">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
