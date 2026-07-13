import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Target, Eye, Heart, MapPin, Phone, Clock, Navigation } from "lucide-react";
import showroom from "@/assets/showroom.jpg";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BRANCHES, SITE } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SL SHOPEE" },
      { name: "description", content: "The story, mission and vision of SL SHOPEE — a trusted multi-branch electronics and furniture showroom." },
      { property: "og:title", content: "About SL SHOPEE" },
      { property: "og:description", content: "Trusted electronics & home furniture showroom across 5 branches." },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div className="pb-10 pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Our story</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          A trusted neighbourhood name for electronics & home furniture
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
          SL SHOPEE was built on one promise — bring genuine, top-brand products to families across the Kakinada region, at honest prices, with warm and knowledgeable service. From a single shop, we've grown to five branches serving thousands of happy households.
        </p>

        <div className="mt-10 overflow-hidden rounded-3xl">
          <img src={showroom} alt="SL SHOPEE showroom" width={1600} height={1000} className="w-full object-cover" />
        </div>
      </div>

      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", text: "Make premium electronics and furniture accessible to every family with trust and transparency." },
            { icon: Eye, title: "Our Vision", text: "Be the most loved home essentials destination across coastal Andhra Pradesh." },
            { icon: Heart, title: "Customer First", text: "Honest advice, fair prices and dependable after-sales care — always." },
          ].map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border/60 bg-white p-6 shadow-elevated"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-gradient p-10 text-white shadow-brand-glow">
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 text-center">
            <Counter to={12} suffix="+" label="Years serving families" />
            <Counter to={10000} suffix="+" label="Happy customers" />
            <Counter to={500} suffix="+" label="Products in catalog" />
            <Counter to={5} label="Branches" />
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Visit us</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          5 branches across the Kakinada region
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">Walk in, meet our team, and see products in person before you buy.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {BRANCHES.map((b, i) => (
            <motion.div key={b.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-elevated">
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"><MapPin className="h-3 w-3" /> Branch</span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{b.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{b.address}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> {b.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> {SITE.hours}</div>
                </div>
                <div className="mt-5 flex gap-2">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + " SL SHOPEE")}`} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow"><Navigation className="h-4 w-4" /> Directions</a>
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:border-brand hover:text-brand"><Phone className="h-4 w-4" /> Call</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <WhatsAppFab />
    </div>
  );
}

function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <div ref={ref}>
      <div className="font-display text-4xl font-bold sm:text-5xl">{n.toLocaleString()}{suffix}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/80">{label}</div>
    </div>
  );
}
