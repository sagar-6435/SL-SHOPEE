import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { SITE, NAV, BRANCHES, waLink } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[oklch(0.18_0.02_260)] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-gradient font-display font-bold text-white">
              SL
            </span>
            <span className="font-display text-xl font-bold text-white">{SITE.name}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Your trusted destination for electronics, home furniture and kitchen essentials across 5 branches.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-brand">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-brand">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">Branches</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {BRANCHES.map((b) => (
              <li key={b.slug} className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{b.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-white">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" /> {SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" /> {SITE.email}</li>
            <li>
              <a href={waLink()} className="mt-2 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-elevated hover:brightness-110">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
          <p className="mt-6 text-xs text-white/50">{SITE.hours}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-brand transition-colors">Refund Policy</Link>
            <Link to="/terms-conditions" className="hover:text-brand transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}