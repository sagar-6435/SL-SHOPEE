import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight, MapPin, Phone, MessageCircle, Star, ShoppingCart, Heart
} from "lucide-react";
import { FaCreditCard, FaShieldHalved, FaStore, FaTag, FaTruck, FaUsers, FaWandSparkles, FaCircleCheck } from "react-icons/fa6";
import heroTv from "@/assets/hero-tv.png";
import showroom from "@/assets/showroom.jpg";
import { BRANCHES, BRANDS, CATEGORIES, PRODUCTS, TESTIMONIALS, waLink } from "@/lib/site-data";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <BrandsMarquee />
      <Categories />
      <WhyChooseUs />
      <FeaturedProducts />
      <OffersBanner />
      <BranchesPreview />
      <Testimonials />
      <WhatsAppFab />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative w-full pt-8 bg-hero-gradient">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-brand/40"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="relative grid w-full items-center gap-10 px-4 py-8 sm:px-6 md:grid-cols-2 md:py-16 lg:px-10 lg:py-20">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white/60 px-3 py-1 text-xs font-semibold text-brand backdrop-blur">
            <FaWandSparkles className="h-3.5 w-3.5" /> 5 branches · Since years
          </span>
          <div className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-[0.05em] text-brand sm:text-5xl md:text-6xl lg:text-7xl">
            SL SHOPEE
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Your Trusted <span className="text-brand">Electronics</span> <br className="hidden sm:block" /> & Home Furniture Destination
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            TVs · Mobiles · Furniture · Home Appliances · Kitchen Essentials — all from leading brands, under one roof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand-glow transition-transform hover:scale-105">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-brand hover:text-brand hover:bg-brand/5 transition-all">
              <MapPin className="h-4 w-4" /> Find Nearest Branch
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Stat n={5} suffix="" label="Branches" />
            <Stat n={50} suffix="+" label="Trusted brands" />
            <Stat n={10000} suffix="+" label="Happy customers" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-brand/20 blur-3xl mt-10" />
          <motion.div
            className="relative animate-float-slow mt-12"
            whileHover={{ rotateY: 8, rotateX: -4 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={heroTv}
              alt="Modern smart TV with red gradient glow"
              width={1280}
              height={1280}
              className="relative w-full rounded-2xl shadow-brand-glow"
            />
          </motion.div>
      <FloatingChip className="left-2 top-6 hidden sm:inline-flex" delay={0.4} icon={FaWandSparkles}>New arrivals</FloatingChip>
          <FloatingChip className="right-4 top-1/3 hidden sm:inline-flex" delay={0.8} icon={FaCreditCard}>EMI available</FloatingChip>
          <FloatingChip className="bottom-6 left-1/4 hidden sm:inline-flex" delay={1.2} icon={FaTag}>Best prices</FloatingChip>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";

function Stat({ n, suffix, label }: { n: number; suffix: string; label: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const interval = 20;
    const step = n / (duration / interval);
    const timer = setInterval(() => {
      start += step;
      if (start >= n) {
        setVal(n);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [n]);

  return (
    <div>
      <div className="font-display text-2xl font-bold text-foreground">{val}{suffix}</div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}

function FloatingChip({ children, className, delay = 0, icon: Icon }: { children: React.ReactNode; className?: string; delay?: number; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-elevated backdrop-blur ${className}`}
    >
      <Icon className="h-3.5 w-3.5 text-brand" />
      {children}
    </motion.div>
  );
}

function BrandsMarquee() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section className="border-y border-border/60 bg-white py-10">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Trusted brands we stock
        </p>
        <div className="mt-6 flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex animate-marquee gap-14 pr-14">
            {doubled.map((b, i) => (
              <span key={i} className="whitespace-nowrap font-display text-2xl font-bold text-foreground/40 transition-colors hover:text-brand">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <SectionHead eyebrow="Shop by category" title="Everything for your home & pocket" />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to="/products"
              search={{ category: c.name }}
              className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border/60 bg-white p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-brand-glow"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/5 transition-all group-hover:bg-brand/20" />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <c.icon className="h-5 w-5" />
              </div>
              <span className="font-display font-semibold">{c.name}</span>
              <span className="mt-auto flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const items = [
    { icon: FaCircleCheck, title: "Genuine Products", desc: "100% brand-authorised inventory only." },
    { icon: FaCreditCard, title: "Easy EMI", desc: "No-cost EMI on select bank cards." },
    { icon: FaShieldHalved, title: "Trusted Brands", desc: "Samsung, LG, Sony, IFB, Whirlpool & more." },
    { icon: FaStore, title: "5 Branches", desc: "Across Kakinada, Pithapuram & nearby." },
    { icon: FaTruck, title: "Home Delivery", desc: "Fast local delivery & installation." },
    { icon: FaUsers, title: "Expert Support", desc: "Friendly staff to help you decide." },
  ];
  return (
    <section className="bg-[oklch(0.98_0.005_260)] py-8">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionHead eyebrow="Why choose us" title="A better way to shop for your home" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-2xl border border-border/60 bg-white p-6 shadow-elevated"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const navigate = useNavigate();
  const featured = PRODUCTS.slice(0, 6);
  const [cart, setCart] = useState<any[]>([]);

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
    <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <SectionHead eyebrow="Featured" title="Bestsellers this month" />
        <Link to="/products" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline sm:inline-flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="group overflow-hidden rounded-2xl border border-border/60 bg-white shadow-elevated"
          >
            <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }} className="group relative block h-48 overflow-hidden bg-[oklch(0.98_0.01_27)] p-3">
              <img
                src={p.image}
                alt={p.name}
                width={1280}
                height={1280}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                {p.brand}
              </span>
              <button
                onClick={(e) => handleAddToWishlist(e, p)}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-muted-foreground shadow-sm hover:text-brand hover:scale-105 transition-all z-10 block"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
            </Link>
            <div className="p-5">
              <Link to="/products/$id" params={{ id: p.name.toLowerCase().replace(/ /g, '-') }}>
                <h3 className="font-display font-semibold hover:text-brand transition-colors">{p.name}</h3>
              </Link>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-brand font-display text-lg font-bold">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.category}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => navigate({ to: '/checkout', search: { product: p.name.toLowerCase().replace(/ /g, '-') } })} type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow transition-transform hover:scale-[1.02]">
                  Buy Now
                </button>
                {cart.find((item: any) => item.name === p.name) ? (
                  <button type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand bg-brand/5 px-4 py-2.5 text-sm font-semibold text-brand transition-colors cursor-default">
                    <ShoppingCart className="h-4 w-4" /> Added to Cart
                  </button>
                ) : (
                  <button onClick={(e) => handleAddToCart(e, p)} type="button" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-brand/5">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function OffersBanner() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 sm:p-10 lg:p-16 text-white shadow-brand-glow"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-white/80">
              Festival Sale · Limited Time
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Special discounts &<br /> no-cost EMI offers
            </h2>
            <p className="mt-4 max-w-md text-white/85">
              Save big on TVs, ACs, washing machines and more. Visit your nearest SL SHOPEE branch today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={waLink("Hi, share today's festival offers.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition-transform hover:scale-105">
                <MessageCircle className="h-4 w-4" /> WhatsApp for offers
              </a>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20">
                <MapPin className="h-4 w-4" /> Visit a branch
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              { n: "10%", l: "Off on TVs" },
              { n: "0%", l: "EMI plans" },
              { n: "5Yr", l: "Warranty" },
              { n: "24h", l: "Delivery" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                <div className="font-display text-3xl font-bold">{s.n}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/80">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function BranchesPreview() {
  return (
    <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
      <SectionHead eyebrow="Visit us" title="5 branches, one trusted name" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BRANCHES.map((b, i) => (
          <motion.div
            key={b.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="group rounded-2xl border border-border/60 bg-white p-6 shadow-elevated transition-all hover:-translate-y-1 hover:border-brand/40"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{b.name}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{b.address}</p>
            <div className="mt-5 flex gap-2">
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + " SL SHOPEE")}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:bg-foreground/85">
                Directions
              </a>
              <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground hover:border-brand hover:text-brand">
                <Phone className="h-3.5 w-3.5" /> Call
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-[oklch(0.98_0.005_260)] py-8">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionHead eyebrow="Loved by families" title="What our customers say" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/60 bg-white p-6 shadow-elevated"
            >
              <div className="flex gap-0.5 text-brand">
                {[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient font-display text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl">
          <img src={showroom} alt="SL SHOPEE showroom interior" width={1600} height={1000} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
