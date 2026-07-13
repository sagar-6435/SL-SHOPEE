import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import branchImg from "@/assets/branch-store.jpg";
import { BRANCHES, SITE } from "@/lib/site-data";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/Branches")({
  head: () => ({
    meta: [
      { title: "Our Branches — SL SHOPEE" },
      { name: "description", content: "Visit SL SHOPEE at Achampeta, Pithapuram, Kathipudi, Gollaprolu and Peddapuram." },
      { property: "og:title", content: "SL SHOPEE Branches" },
      { property: "og:description", content: "5 branches across Kakinada region — find your nearest SL SHOPEE store." },
    ],
  }),
  component: BranchesPage,
});

export function BranchesPage() {
  return (
    <div className="pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Visit us</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          5 branches across the Kakinada region
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Walk in, meet our team, and see products in person before you buy.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-elevated"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={branchImg} alt={`${b.name} branch`} width={1200} height={800} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand">
                    <MapPin className="h-3 w-3" /> Branch
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-white">{b.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground">{b.address}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> {b.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> {SITE.hours}</div>
                </div>
                <div className="mt-5 flex gap-2">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + " SL SHOPEE")}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow">
                    <Navigation className="h-4 w-4" /> Directions
                  </a>
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:border-brand hover:text-brand">
                    <Phone className="h-4 w-4" /> Call
                  </a>
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
