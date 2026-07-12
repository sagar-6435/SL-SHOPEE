import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-data";

export function WhatsAppFab() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-elevated transition-transform hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}