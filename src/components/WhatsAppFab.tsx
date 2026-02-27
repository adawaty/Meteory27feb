import { MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhatsAppFab() {
  const { language } = useLanguage();
  const label = language === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp";

  return (
    <a
      href={COMPANY_INFO.whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary text-white shadow-lg px-4 py-3 font-semibold hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
