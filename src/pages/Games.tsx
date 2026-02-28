import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, ClipboardCheck, Droplets, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function GamesHub() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("Games | Meteory", "الألعاب | Meteory");
  const description = t(
    "Short, intuitive safety games: training loops that are easy to play and addictive.",
    "ألعاب سلامة بسيطة وسهلة: تدريب تفاعلي ممتع."
  );

  const cards = [
    {
      href: "/game",
      icon: <Flame className="h-5 w-5" />,
      titleEn: "Fire Safety Challenge",
      titleAr: "تحدي السلامة من الحريق",
      bodyEn: "Endless grid containment with scenarios (standard / electrical / chemical).",
      bodyAr: "لعبة لا نهائية مع سيناريوهات (قياسي / كهربائي / كيميائي).",
    },
    {
      href: "/games/hydrant-run",
      icon: <Droplets className="h-5 w-5" />,
      titleEn: "Hydrant Run",
      titleAr: "سباق الهيدرنت",
      bodyEn: "Fast reflex: match the right hose/nozzle setup before time runs out.",
      bodyAr: "سرعة وتركيز: اختر التجهيز المناسب قبل انتهاء الوقت.",
    },
    {
      href: "/games/inspection-sprint",
      icon: <ClipboardCheck className="h-5 w-5" />,
      titleEn: "Inspection Sprint",
      titleAr: "فحص سريع",
      bodyEn: "Spot issues in a checklist loop to build habits (endless).",
      bodyAr: "اكتشف الأخطاء في قائمة فحص لتكوين عادات (لا نهائي).",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/games" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">{t("Training Arcade", "أركيد التدريب")}</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t("Safety Games", "ألعاب السلامة")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t(
              "Mini games designed to be easy to understand and replayable — perfect for quick training and engagement.",
              "ألعاب صغيرة سهلة الفهم وقابلة للإعادة — تدريب سريع وتفاعل أعلى."
            )}
          </p>
        </div>
      </div>

      <div className="container px-4 py-12 grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card key={c.href} className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {c.icon} {language === "ar" ? c.titleAr : c.titleEn}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "ar" ? c.bodyAr : c.bodyEn}
              </p>
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                <Link href={c.href}>
                  {t("Play", "ابدأ")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
