import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Timer, Repeat } from "lucide-react";

type Round = {
  promptEn: string;
  promptAr: string;
  options: Array<{ id: string; labelEn: string; labelAr: string; ok: boolean }>;
};

const BANK: Round[] = [
  {
    promptEn: "Small electrical panel fire. What do you pick?",
    promptAr: "حريق بسيط في لوحة كهرباء. تختار ماذا؟",
    options: [
      { id: "co2", labelEn: "CO2 / clean agent", labelAr: "CO2 / عامل نظيف", ok: true },
      { id: "water", labelEn: "Water jet", labelAr: "ماء مباشر", ok: false },
      { id: "foam", labelEn: "Foam blanket", labelAr: "رغوة", ok: false },
    ],
  },
  {
    promptEn: "Warehouse hydrant test: target flow is low. First check?",
    promptAr: "اختبار هيدرنت: التصرف ضعيف. أول شيء تفحصه؟",
    options: [
      { id: "valve", labelEn: "Main valve partially closed", labelAr: "محبس رئيسي مغلق جزئياً", ok: true },
      { id: "paint", labelEn: "Paint color", labelAr: "لون الطلاء", ok: false },
      { id: "sign", labelEn: "Signage", labelAr: "اللافتات", ok: false },
    ],
  },
  {
    promptEn: "You need a quick attack line for a small spill fire. Choose nozzle pattern:",
    promptAr: "حريق تسرب بسيط. تختار نمط الرش:",
    options: [
      { id: "fog", labelEn: "Fog / wide pattern", labelAr: "ضباب / انتشار واسع", ok: true },
      { id: "straight", labelEn: "Straight stream only", labelAr: "مباشر فقط", ok: false },
      { id: "closed", labelEn: "No flow", labelAr: "بدون تدفق", ok: false },
    ],
  },
];

export default function HydrantRun() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("Hydrant Run | Meteory", "سباق الهيدرنت | Meteory");
  const description = t(
    "A quick reflex training game: pick the right hydrant response under time pressure.",
    "لعبة تدريب سريعة: اختر التصرف الصحيح تحت ضغط الوقت."
  );

  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [seed, setSeed] = useState(0);

  const round = useMemo(() => {
    const i = Math.abs((seed * 9973 + score * 17) % BANK.length);
    return BANK[i];
  }, [seed, score]);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, time]);

  const reset = () => {
    setRunning(false);
    setTime(10);
    setScore(0);
    setStreak(0);
    setSeed((s) => s + 1);
  };

  const pick = (ok: boolean) => {
    if (!running) return;
    if (ok) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((s) => s + 10 + Math.min(25, nextStreak * 2));
      setTime((s) => Math.min(15, s + 1));
    } else {
      setStreak(0);
      setScore((s) => Math.max(0, s - 5));
      setTime((s) => Math.max(0, s - 2));
    }
    setSeed((s) => s + 1);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/games/hydrant-run" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">{t("Training Arcade", "أركيد التدريب")}</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t("Hydrant Run", "سباق الهيدرنت")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t(
              "Answer fast. The loop is endless and additive: correct answers extend time and stack points.",
              "جاوب بسرعة. اللعبة لا نهائية والنتيجة تزيد: الإجابة الصحيحة تزيد الوقت والنقاط."
            )}
          </p>
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_0.55fr] gap-8">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <Droplets className="h-4 w-4" /> {t("Scenario", "سيناريو")}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4" /> {time}s</span>
                  <span>{t("Score", "النتيجة")}: {score}</span>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={(time / 15) * 100} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg font-semibold leading-snug">{language === "ar" ? round.promptAr : round.promptEn}</div>
              <div className="grid sm:grid-cols-3 gap-2">
                {round.options.map((o) => (
                  <Button
                    key={o.id}
                    variant="outline"
                    className="rounded-md h-auto py-4 text-left whitespace-normal"
                    onClick={() => pick(o.ok)}
                    disabled={!running}
                  >
                    {language === "ar" ? o.labelAr : o.labelEn}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("Streak", "سلسلة")}: {streak} • {t("Tip", "نصيحة")}: {t("Correct answers add time.", "الإجابات الصحيحة تزيد الوقت.")}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Controls", "التحكم")}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              {!running ? (
                <Button className="rounded-md w-full" onClick={() => setRunning(true)}>
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
                  "This game doesn’t submit to the main leaderboard yet — it’s a quick engagement loop.",
                  "هذه اللعبة لا تُرسل للوحة الشرف الرئيسية حالياً — هدفها تفاعل سريع."
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
