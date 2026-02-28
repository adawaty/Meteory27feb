import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Eye, Repeat, Timer } from "lucide-react";

type Issue = {
  id: string;
  textEn: string;
  textAr: string;
  ok: boolean;
};

const ISSUE_BANK: Issue[] = [
  { id: "pin", textEn: "Extinguisher pin is missing", textAr: "مسمار الأمان مفقود", ok: true },
  { id: "pressure", textEn: "Pressure gauge is in red zone", textAr: "مؤشر الضغط في المنطقة الحمراء", ok: true },
  { id: "blocked", textEn: "Access blocked by storage boxes", textAr: "الوصول مسدود بصناديق", ok: true },
  { id: "label", textEn: "Instruction label is unreadable", textAr: "الملصق غير مقروء", ok: true },
  { id: "paint", textEn: "Paint looks new", textAr: "الدهان جديد", ok: false },
  { id: "brand", textEn: "Brand logo is centered", textAr: "الشعار في المنتصف", ok: false },
  { id: "shiny", textEn: "Surface is shiny", textAr: "السطح لامع", ok: false },
];

function shuffle<T>(arr: T[], seed: number) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function InspectionSprint() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("Inspection Sprint | Meteory", "فحص سريع | Meteory");
  const description = t(
    "Endless checklist loop: spot the issues and build inspection habits.",
    "لعبة لا نهائية: اكتشف المشاكل بسرعة لتكوين عادة الفحص."
  );

  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(12);
  const [score, setScore] = useState(0);
  const [seed, setSeed] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reveal, setReveal] = useState(false);

  const issues = useMemo(() => shuffle(ISSUE_BANK, seed).slice(0, 6), [seed]);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setReveal(true);
      return;
    }
    const id = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, time]);

  const reset = () => {
    setRunning(false);
    setTime(12);
    setScore(0);
    setSeed((s) => s + 1);
    setSelected({});
    setReveal(false);
  };

  const toggle = (id: string) => {
    if (!running) return;
    setSelected((m) => ({ ...m, [id]: !m[id] }));
  };

  const submit = () => {
    const picked = issues.filter((i) => selected[i.id]);
    const correct = picked.filter((i) => i.ok).length;
    const wrong = picked.filter((i) => !i.ok).length;
    const missed = issues.filter((i) => i.ok && !selected[i.id]).length;

    const delta = correct * 10 - wrong * 5 - missed * 2;
    setScore((s) => Math.max(0, s + delta + 5)); // additive baseline
    setReveal(true);
    setRunning(false);
    setSeed((s) => s + 1);
    setSelected({});
    setTime(12);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/games/inspection-sprint" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">{t("Training Arcade", "أركيد التدريب")}</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t("Inspection Sprint", "فحص سريع")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t(
              "Endless habit loop: select the real issues, avoid distractions. Score always grows.",
              "لعبة عادات لا نهائية: اختر المشاكل الحقيقية وتجنب المشتتات. النتيجة تزيد دائماً."
            )}
          </p>
        </div>
      </div>

      <div className="container px-4 py-12 grid lg:grid-cols-[1fr_0.55fr] gap-8">
        <Card className="rounded-none border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <ClipboardCheck className="h-4 w-4" /> {t("Checklist", "قائمة الفحص")}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4" /> {time}s</span>
                <span>{t("Score", "النتيجة")}: {score}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.map((it) => {
              const active = !!selected[it.id];
              const showOk = reveal ? it.ok : undefined;
              return (
                <button
                  key={it.id}
                  className={`w-full text-left border border-border rounded-md px-4 py-3 transition-colors ${
                    active ? "bg-secondary" : "bg-background"
                  }`}
                  onClick={() => toggle(it.id)}
                  disabled={!running}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">
                      {language === "ar" ? it.textAr : it.textEn}
                    </div>
                    {reveal && (
                      <Badge variant={it.ok ? "default" : "outline"} className="rounded-full">
                        {it.ok ? t("Issue", "مشكلة") : t("Not an issue", "ليس مشكلة")}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}

            <div className="pt-2 flex flex-wrap gap-2">
              <Button className="rounded-md" onClick={submit} disabled={!running}>
                <Eye className="h-4 w-4" /> {t("Review", "مراجعة")}
              </Button>
              <Button variant="outline" className="rounded-md" onClick={() => setReveal(false)} disabled={running}>
                {t("Hide labels", "إخفاء")}
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              {t("Tip: pick only real hazards.", "نصيحة: اختر فقط المخاطر الحقيقية.")}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Controls", "التحكم")}</div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!running ? (
              <Button className="rounded-md w-full" onClick={() => { setRunning(true); setReveal(false); }}>
                {t("Start", "ابدأ")}
              </Button>
            ) : (
              <Button variant="outline" className="rounded-md w-full" onClick={() => setRunning(false)}>
                {t("Pause", "إيقاف")}
              </Button>
            )}
            <Button variant="outline" className="rounded-md w-full" onClick={reset}>
              <Repeat className="h-4 w-4" /> {t("Reset", "إعادة")}
            </Button>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "This game does not submit to the main leaderboard yet.",
                "هذه اللعبة لا تُرسل للوحة الشرف الرئيسية حالياً."
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
