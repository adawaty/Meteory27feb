import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const PARTS = [
  {
    id: "cylinders",
    labelEn: "Cylinders",
    labelAr: "الأسطوانات",
    descEn: "Agent storage cylinders (sized by room volume and design concentration).",
    descAr: "أسطوانات تخزين العامل (تُحدد حسب حجم الغرفة وتركيز التصميم).",
  },
  {
    id: "valve",
    labelEn: "Valve & Actuation",
    labelAr: "الصمام والتشغيل",
    descEn: "Release valve, pressure gauge, and actuation hardware.",
    descAr: "صمام التفريغ والعدادات ووحدة التشغيل.",
  },
  {
    id: "piping",
    labelEn: "Piping Network",
    labelAr: "شبكة المواسير",
    descEn: "Engineered piping sized by flow and nozzle layout.",
    descAr: "شبكة مواسير هندسية حسب التصرف وتوزيع الفوهات.",
  },
  {
    id: "nozzles",
    labelEn: "Nozzles",
    labelAr: "الفوهات",
    descEn: "Discharge nozzles placed to achieve uniform concentration.",
    descAr: "فوهات تفريغ تُوزّع لتحقيق تركيز منتظم.",
  },
  {
    id: "detection",
    labelEn: "Detection & Control",
    labelAr: "الكشف والتحكم",
    descEn: "Detectors, panel, and release logic (with safety delays).",
    descAr: "حساسات ولوحة إنذار ومنطق تشغيل (مع تأخير أمان).",
  },
];

export default function ExplodedFm200() {
  const { language } = useLanguage();
  const [active, setActive] = useState<string>("cylinders");

  const t = (en: string, ar: string) => (language === "ar" ? ar : en);
  const current = PARTS.find((p) => p.id === active) || PARTS[0];

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/40">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {t("Interactive exploded view", "عرض تفكيكي تفاعلي")}
        </div>
        <div className="mt-1 font-heading font-semibold text-foreground">
          {t("FM-200 system anatomy (planning view)", "مكونات نظام FM-200 (عرض تخطيطي)")}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* SVG side */}
        <div className="p-5">
          <svg
            viewBox="0 0 780 420"
            className="w-full h-auto"
            role="img"
            aria-label={t("FM-200 system exploded diagram", "مخطط تفكيكي لنظام FM-200")}
          >
            <defs>
              <linearGradient id="metal" x1="0" x2="1">
                <stop offset="0" stopColor="#d8dee9" />
                <stop offset="1" stopColor="#9aa6b2" />
              </linearGradient>
              <linearGradient id="pipe" x1="0" x2="1">
                <stop offset="0" stopColor="#0b1a2b" />
                <stop offset="1" stopColor="#1d3a57" />
              </linearGradient>
              <linearGradient id="accent" x1="0" x2="1">
                <stop offset="0" stopColor="#dc2626" />
                <stop offset="1" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* cylinders */}
            <g
              className={cn("cursor-pointer", active === "cylinders" && "opacity-100", active !== "cylinders" && "opacity-75 hover:opacity-95")}
              onClick={() => setActive("cylinders")}
            >
              <rect x="60" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="240" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="420" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="60" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
              <rect x="240" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
              <rect x="420" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
            </g>

            {/* valve/actuation */}
            <g
              className={cn("cursor-pointer", active === "valve" && "opacity-100", active !== "valve" && "opacity-75 hover:opacity-95")}
              onClick={() => setActive("valve")}
            >
              <circle cx="600" cy="105" r="26" fill="url(#accent)" />
              <rect x="585" y="135" width="30" height="60" rx="10" fill="#111827" opacity="0.92" />
              <circle cx="600" cy="205" r="18" fill="#e5e7eb" stroke="#94a3b8" />
            </g>

            {/* piping */}
            <g
              className={cn("cursor-pointer", active === "piping" && "opacity-100", active !== "piping" && "opacity-75 hover:opacity-95")}
              onClick={() => setActive("piping")}
            >
              <path d="M110 60 H600" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
              <path d="M600 60 V320" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
              <path d="M600 320 H700" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
            </g>

            {/* nozzles */}
            <g
              className={cn("cursor-pointer", active === "nozzles" && "opacity-100", active !== "nozzles" && "opacity-75 hover:opacity-95")}
              onClick={() => setActive("nozzles")}
            >
              <circle cx="720" cy="320" r="18" fill="#111827" />
              <circle cx="720" cy="320" r="7" fill="#e5e7eb" />
              <path d="M720 345 C705 368 690 378 672 390" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.85" />
              <path d="M720 345 C735 368 750 378 768 390" stroke="#dc2626" strokeWidth="3" fill="none" opacity="0.85" />
            </g>

            {/* detection/control */}
            <g
              className={cn("cursor-pointer", active === "detection" && "opacity-100", active !== "detection" && "opacity-75 hover:opacity-95")}
              onClick={() => setActive("detection")}
            >
              <rect x="610" y="235" width="140" height="70" rx="14" fill="#0b1a2b" />
              <rect x="625" y="250" width="110" height="10" rx="6" fill="#e5e7eb" opacity="0.9" />
              <rect x="625" y="270" width="70" height="10" rx="6" fill="#94a3b8" opacity="0.9" />
              <circle cx="735" cy="285" r="6" fill="#dc2626" />
            </g>

            {/* legend anchors */}
            <text x="60" y="400" fontSize="12" fill="#64748b">
              {t("Click a part to learn what it does.", "اضغط على أي جزء لمعرفة وظيفته.")}
            </text>
          </svg>
        </div>

        {/* text side */}
        <div className="p-5 border-t lg:border-t-0 lg:border-l border-border">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("Selected part", "الجزء المحدد")}
          </div>
          <div className="mt-2 text-xl font-heading font-bold text-foreground">
            {t(current.labelEn, current.labelAr)}
          </div>
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t(current.descEn, current.descAr)}
          </div>

          <div className="mt-6 grid gap-2">
            {PARTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={cn(
                  "text-left rounded-lg border border-border px-3 py-2 text-sm",
                  p.id === active ? "bg-primary text-primary-foreground border-primary" : "bg-white hover:bg-secondary"
                )}
              >
                {t(p.labelEn, p.labelAr)}
              </button>
            ))}
          </div>

          <div className="mt-6 text-xs text-muted-foreground leading-relaxed">
            {t(
              "Planning visualization only. Final design must follow NFPA 2001 / manufacturer software and the AHJ requirements.",
              "عرض توضيحي للتخطيط فقط. التصميم النهائي يجب أن يتبع NFPA 2001 وبرامج الشركة المصنعة ومتطلبات الجهة المختصة."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
