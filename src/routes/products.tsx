import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Filter } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/site-data";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/products")({
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

function ProductsPage() {
  const [active, setActive] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const cats = ["All", ...CATEGORIES.map((c) => c.name)];
  const filtered = useMemo(
    () => (active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  );
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Our catalog</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">All Products</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Explore our full range from leading brands. Enquire on WhatsApp for latest prices, offers and stock at your nearest branch.
        </p>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          aria-expanded={showFilters}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand hover:text-brand"
        >
          <Filter className="h-4 w-4 text-brand" />
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
      </div>

      <div className={`mt-8 grid gap-8 ${showFilters ? "lg:grid-cols-[220px_1fr]" : "lg:grid-cols-1"}`}>
        {showFilters ? (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Filter className="h-4 w-4 text-brand" /> Categories
            </div>
            <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className={`rounded-full px-4 py-2 text-left text-sm transition-colors ${
                    active === c
                      ? "bg-brand text-brand-foreground shadow-brand-glow"
                      : "bg-white text-foreground/70 hover:bg-brand/10 hover:text-brand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-elevated"
            >
              <div className="group relative h-44 overflow-hidden bg-[oklch(0.98_0.01_27)] p-3">
                <img
                  src={p.image}
                  alt={p.name}
                  width={1280}
                  height={1280}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                  {p.brand}
                </span>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <h3 className="mt-1 font-display font-semibold">{p.name}</h3>
                <div className="mt-2 text-brand font-display text-lg font-bold">{p.price}</div>
                <button
                  type="button"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow transition-transform hover:scale-[1.02]"
                >
                  <ShoppingCart className="h-4 w-4" /> Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <WhatsAppFab />
    </div>
  );
}