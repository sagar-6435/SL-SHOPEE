import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Phone, Mail, Clock, MessageCircle, MapPin, Send } from "lucide-react";
import { SITE, waLink } from "@/lib/site-data";
import { useState, type ComponentType } from "react";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SL SHOPEE" },
      { name: "description", content: "Talk to SL SHOPEE — phone, WhatsApp, email and branch directions." },
      { property: "og:title", content: "Contact SL SHOPEE" },
      { property: "og:description", content: "Reach us for enquiries, offers and after-sales support." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Get in touch</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">We're here to help</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Message us on WhatsApp for the fastest response, or drop us a note below.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <InfoRow icon={Phone} title="Phone" text={SITE.phone} />
            <InfoRow icon={Mail} title="Email" text={SITE.email} />
            <InfoRow icon={MessageCircle} title="WhatsApp" text="Chat with us instantly" href={waLink()} accent />
            <InfoRow icon={Clock} title="Working hours" text={SITE.hours} />
            <InfoRow icon={MapPin} title="Head office" text="Achampeta (Kakinada)" />
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl border border-border/60 bg-white p-6 shadow-elevated sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" name="name" />
              <Field label="Phone" name="phone" />
            </div>
            <div className="mt-4">
              <Field label="Email" name="email" type="email" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea rows={5} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand" placeholder="Which product are you interested in?" />
            </div>
            <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-brand-foreground shadow-brand-glow transition-transform hover:scale-105">
              <Send className="h-4 w-4" /> Send message
            </button>
            {sent && <p className="mt-4 text-sm text-whatsapp">Thanks! We'll get back to you shortly.</p>}
          </motion.form>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-border/60">
          <iframe
            title="SL SHOPEE branch map"
            src="https://www.google.com/maps?q=Kakinada&output=embed"
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
      </div>
      <WhatsAppFab />
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input name={name} type={type} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-brand" />
    </div>
  );
}

function InfoRow({ icon: Icon, title, text, href, accent }: { icon: ComponentType<{ className?: string }>; title: string; text: string; href?: string; accent?: boolean }) {
  const inner = (
    <>
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent ? "bg-whatsapp text-white" : "bg-brand/10 text-brand"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="mt-1 font-semibold text-foreground">{text}</div>
      </div>
    </>
  );
  const cls = `flex items-start gap-4 rounded-2xl border p-5 shadow-elevated transition-colors ${accent ? "border-whatsapp/40 bg-whatsapp/5" : "border-border/60 bg-white"} ${href ? "hover:border-brand/40" : ""}`;
  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
  }
  return <div className={cls}>{inner}</div>;
}