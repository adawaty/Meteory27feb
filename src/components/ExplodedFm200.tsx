import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

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
] as const;

type PartId = (typeof PARTS)[number]["id"];

const OFFSETS: Record<PartId, { x: number; y: number; rotate?: number }> = {
  cylinders: { x: -10, y: 8 },
  valve: { x: 14, y: -10 },
  piping: { x: 0, y: -14 },
  nozzles: { x: 16, y: 10 },
  detection: { x: 10, y: 14 },
};

export default function ExplodedFm200() {
  const { language } = useLanguage();
  const [active, setActive] = useState<PartId>("cylinders");

  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const current = useMemo(() => PARTS.find((p) => p.id === active) || PARTS[0], [active]);

  const sequence = useMemo(
    () =>
      language === "ar"
        ? [
            {
              id: "detection" as PartId,
              title: "1) كشف + تأكيد إنذار",
              body: "الحساسات ترصد وتقوم اللوحة بالتأكيد قبل التشغيل.",
            },
            {
              id: "valve" as PartId,
              title: "2) تأخير أمان + تشغيل",
              body: "تأخير للتنبيه والإخلاء (حسب التصميم) ثم تفعيل التشغيل.",
            },
            {
              id: "cylinders" as PartId,
              title: "3) فتح الأسطوانات",
              body: "فتح الصمام وتحرير العامل من الأسطوانات.",
            },
            {
              id: "piping" as PartId,
              title: "4) انتقال عبر الشبكة",
              body: "العامل يتحرك عبر شبكة المواسير المصممة هندسياً.",
            },
            {
              id: "nozzles" as PartId,
              title: "5) تفريغ عبر الفوهات",
              body: "تفريغ موزّع لتحقيق تركيز إخماد مناسب.",
            },
          ]
        : [
            {
              id: "detection" as PartId,
              title: "1) Detection + alarm verification",
              body: "Detectors trigger and the panel verifies conditions before release.",
            },
            {
              id: "valve" as PartId,
              title: "2) Safety delay + actuation",
              body: "Pre-discharge delay (as designed) then actuation hardware engages.",
            },
            {
              id: "cylinders" as PartId,
              title: "3) Cylinder release",
              body: "Valve opens and agent is released from storage cylinders.",
            },
            {
              id: "piping" as PartId,
              title: "4) Flow through the network",
              body: "Agent travels through engineered piping sized by flow + layout.",
            },
            {
              id: "nozzles" as PartId,
              title: "5) Discharge at nozzles",
              body: "Nozzles distribute agent to reach the target concentration.",
            },
          ],
    [language]
  );

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

              {/* subtle glow for the active selection */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 0.2 0 0 0  0 0 0.2 0 0  0 0 0 0.7 0"
                />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* piping */}
            <motion.g
              onClick={() => setActive("piping")}
              className={cn(
                "cursor-pointer",
                active === "piping" ? "opacity-100" : "opacity-70 hover:opacity-95"
              )}
              animate={
                active === "piping"
                  ? { x: OFFSETS.piping.x, y: OFFSETS.piping.y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0.8 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              filter={active === "piping" ? "url(#glow)" : undefined}
            >
              <path d="M110 60 H600" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
              <path d="M600 60 V320" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
              <path d="M600 320 H700" stroke="url(#pipe)" strokeWidth="16" strokeLinecap="round" />
            </motion.g>

            {/* cylinders */}
            <motion.g
              onClick={() => setActive("cylinders")}
              className={cn(
                "cursor-pointer",
                active === "cylinders" ? "opacity-100" : "opacity-70 hover:opacity-95"
              )}
              animate={
                active === "cylinders"
                  ? { x: OFFSETS.cylinders.x, y: OFFSETS.cylinders.y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0.85 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              filter={active === "cylinders" ? "url(#glow)" : undefined}
            >
              <rect x="60" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="240" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="420" y="90" width="150" height="250" rx="28" fill="url(#metal)" stroke="#94a3b8" />
              <rect x="60" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
              <rect x="240" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
              <rect x="420" y="70" width="150" height="45" rx="14" fill="#e5e7eb" stroke="#94a3b8" />
            </motion.g>

            {/* valve/actuation */}
            <motion.g
              onClick={() => setActive("valve")}
              className={cn(
                "cursor-pointer",
                active === "valve" ? "opacity-100" : "opacity-70 hover:opacity-95"
              )}
              animate={
                active === "valve"
                  ? { x: OFFSETS.valve.x, y: OFFSETS.valve.y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0.85 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              filter={active === "valve" ? "url(#glow)" : undefined}
            >
              <circle cx="600" cy="105" r="26" fill="url(#accent)" />
              <rect x="585" y="135" width="30" height="60" rx="10" fill="#111827" opacity="0.92" />
              <circle cx="600" cy="205" r="18" fill="#e5e7eb" stroke="#94a3b8" />
            </motion.g>

            {/* detection/control */}
            <motion.g
              onClick={() => setActive("detection")}
              className={cn(
                "cursor-pointer",
                active === "detection" ? "opacity-100" : "opacity-70 hover:opacity-95"
              )}
              animate={
                active === "detection"
                  ? { x: OFFSETS.detection.x, y: OFFSETS.detection.y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0.85 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              filter={active === "detection" ? "url(#glow)" : undefined}
            >
              <rect x="610" y="235" width="140" height="70" rx="14" fill="#0b1a2b" />
              <rect x="625" y="250" width="110" height="10" rx="6" fill="#e5e7eb" opacity="0.9" />
              <rect x="625" y="270" width="70" height="10" rx="6" fill="#94a3b8" opacity="0.9" />
              <circle cx="735" cy="285" r="6" fill="#dc2626" />
            </motion.g>

            {/* nozzles */}
            <motion.g
              onClick={() => setActive("nozzles")}
              className={cn(
                "cursor-pointer",
                active === "nozzles" ? "opacity-100" : "opacity-70 hover:opacity-95"
              )}
              animate={
                active === "nozzles"
                  ? { x: OFFSETS.nozzles.x, y: OFFSETS.nozzles.y, opacity: 1 }
                  : { x: 0, y: 0, opacity: 0.85 }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              filter={active === "nozzles" ? "url(#glow)" : undefined}
            >
              <circle cx="720" cy="320" r="18" fill="#111827" />
              <circle cx="720" cy="320" r="7" fill="#e5e7eb" />

              {/* discharge sprays (animate subtly when active) */}
              <motion.path
                d="M720 345 C705 368 690 378 672 390"
                stroke="#dc2626"
                strokeWidth="3"
                fill="none"
                opacity="0.9"
                initial={false}
                animate={active === "nozzles" ? { pathLength: 1, opacity: 1 } : { pathLength: 0.35, opacity: 0.7 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M720 345 C735 368 750 378 768 390"
                stroke="#dc2626"
                strokeWidth="3"
                fill="none"
                opacity="0.9"
                initial={false}
                animate={active === "nozzles" ? { pathLength: 1, opacity: 1 } : { pathLength: 0.35, opacity: 0.7 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.g>

            {/* hint */}
            <text x="60" y="400" fontSize="12" fill="#64748b">
              {t("Click a part or a step to learn how it works.", "اضغط على جزء أو خطوة لمعرفة كيف يعمل النظام.")}
            </text>
          </svg>
        </div>

        {/* text side */}
        <div className="p-5 border-t lg:border-t-0 lg:border-l border-border">
          <Tabs defaultValue="part">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="part">{t("Part", "الجزء")}</TabsTrigger>
              <TabsTrigger value="sequence">{t("How it works", "كيف يعمل")}</TabsTrigger>
            </TabsList>

            <TabsContent value="part" className="mt-5">
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
                      p.id === active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white hover:bg-secondary"
                    )}
                  >
                    {t(p.labelEn, p.labelAr)}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sequence" className="mt-5">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t("Sequence (planning)", "تسلسل التشغيل (تخطيطي)")}
              </div>
              <div className="mt-3 grid gap-3">
                {sequence.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "rounded-lg border border-border p-3 text-left bg-white hover:bg-secondary transition-colors",
                      active === s.id && "border-primary"
                    )}
                  >
                    <div className="font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.body}</div>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

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
