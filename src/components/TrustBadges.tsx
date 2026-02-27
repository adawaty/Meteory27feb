import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrustBadges() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  return (
    // On desktop, keep badges above the WhatsApp FAB.
    <div className="fixed bottom-[5.25rem] right-5 z-40 hidden md:block">
      <div className="bg-white/95 backdrop-blur border border-slate-200 shadow-lg rounded-xl p-3 w-[17.5rem]">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-slate-700 mb-2">
          {t("Certifications", "الشهادات")}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 flex items-center gap-2 text-[11px] font-bold">
            <BadgeCheck className="h-4 w-4 text-primary" /> ISO 9001:2015
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 flex items-center gap-2 text-[11px] font-bold">
            <Clock className="h-4 w-4 text-primary" /> {t("50+ Years", "أكثر من 50 سنة")}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 flex items-center gap-2 text-[11px] font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" /> {t("UL Certified", "معتمد UL")}
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 flex items-center gap-2 text-[11px] font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" /> {t("FM Approved", "معتمد FM")}
          </div>
        </div>
      </div>
    </div>
  );
}
