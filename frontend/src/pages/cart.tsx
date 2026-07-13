import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site-data';

export const Route = createFileRoute('/cart')({
  component: CartPage,
});

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    };
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const updateQty = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].qty = Math.max(1, newCart[index].qty + delta);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + price * (item.qty || 1);
    }, 0);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[oklch(0.98_0.005_260)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-white p-12 text-center shadow-sm">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-brand/10 text-brand mb-6">
              <ShoppingCart className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">Looks like you haven't added any premium electronics or furniture to your cart yet.</p>
            <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-3.5 text-sm font-bold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">

            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-border/60 bg-white p-2 sm:p-6 shadow-sm">
                <ul className="divide-y divide-border/60">
                  {cart.map((item, index) => (
                    <li key={index} className="flex py-6 px-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-[oklch(0.98_0.01_27)] p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-bold text-foreground">
                            <h3>
                              <Link to="/products/$id" params={{ id: item.name.toLowerCase().replace(/ /g, '-') }} className="hover:text-brand">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="ml-4 text-brand">{item.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.brand} | {item.category}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border border-border/80 rounded-full bg-muted/30">
                            <button onClick={() => updateQty(index, -1)} className="px-3 py-1 font-bold hover:text-brand">-</button>
                            <span className="px-2 font-semibold">{item.qty}</span>
                            <button onClick={() => updateQty(index, 1)} className="px-3 py-1 font-bold hover:text-brand">+</button>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="font-medium text-destructive hover:text-destructive/80 inline-flex items-center gap-1.5"
                            >
                              <Trash2 className="h-4 w-4" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <p>Subtotal</p>
                    <p className="font-semibold text-foreground">₹{calculateTotal().toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <p>Shipping</p>
                    <p className="font-semibold text-brand">Free</p>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <p>Tax</p>
                    <p>Calculated at checkout</p>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-4 mt-4 font-bold text-lg text-foreground">
                    <p>Total</p>
                    <p>₹{calculateTotal().toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <button onClick={() => navigate({ to: '/checkout' })} className="mt-8 w-full rounded-full bg-brand-gradient py-4 text-[15px] font-bold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
                  Checkout securely
                </button>
              </div>

              <div className="rounded-3xl border border-border/60 bg-[#F4F5F7] p-6 text-sm text-center">
                <p className="font-semibold text-muted-foreground">Need help?</p>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="mt-2 text-brand font-bold block hover:underline">
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
