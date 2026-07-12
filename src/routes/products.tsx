import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Filter } from "lucide-react";
import { CATEGORIES, PRODUCTS, waLink } from "@/lib/site-data";
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

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
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
              <div className="group relative flex h-44 items-center justify-center overflow-hidden bg-[oklch(0.97_0.01_27)]">
                <span className="text-6xl transition-transform duration-500 group-hover:scale-110">{p.emoji}</span>
                <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
                  {p.brand}
                </span>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <h3 className="mt-1 font-display font-semibold">{p.name}</h3>
                <div className="mt-2 text-brand font-display text-lg font-bold">{p.price}</div>
                <a
                  href={waLink(`Hi SL SHOPEE, please share details of "${p.name}" (${p.brand}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <WhatsAppFab />
    </div>
  );
}