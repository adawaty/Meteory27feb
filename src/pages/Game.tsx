import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Trophy,
  Flame,
  Droplets,
  Shield,
  Zap,
  FlaskConical,
  ArrowRight,
  MousePointerClick,
  HeartPulse,
  Plus,
} from "lucide-react";
import { Link } from "wouter";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";

type Tile = {
  state: "empty" | "fire" | "wet" | "extinguisher" | "sprinkler";
  heat: number;
};

type ScenarioId = "standard" | "electrical" | "chemical";

type Scenario = {
  id: ScenarioId;
  labelEn: string;
  labelAr: string;
  hintEn: string;
  hintAr: string;
  allowSprinkler: boolean;
  sprinklerCost: number;
  extinguisherCost: number;
  spreadBase: number;
  heatInc: number;
  extinguisherCool: number;
  sprinklerCool: number;
  sprinklerFireQuench: number;
  wetDryChance: number;
  flareChance: number;
  spawnEveryTicks: number;
  scoreMultiplier: number;
};

const GRID = 11;
const TICK_MS = 420;

const SCENARIOS: Scenario[] = [
  {
    id: "standard",
    labelEn: "Standard",
    labelAr: "قياسي",
    hintEn: "Balanced. Use sprinklers for zones, extinguishers for hotspots.",
    hintAr: "متوازن. استخدم الرشاشات للمناطق والطفايات للبؤر.",
    allowSprinkler: true,
    sprinklerCost: 3,
    extinguisherCost: 1,
    spreadBase: 0.115,
    heatInc: 0.24,
    extinguisherCool: 0.55,
    sprinklerCool: 0.25,
    sprinklerFireQuench: 0.7,
    wetDryChance: 0.09,
    flareChance: 0.0,
    spawnEveryTicks: 10,
    scoreMultiplier: 1,
  },
  {
    id: "electrical",
    labelEn: "Electrical",
    labelAr: "كهربائي",
    hintEn: "Sprinklers disabled. Faster spread + occasional arc flare-ups.",
    hintAr: "الرشاشات غير متاحة. انتشار أسرع + اشتعال مفاجئ أحياناً.",
    allowSprinkler: false,
    sprinklerCost: 999,
    extinguisherCost: 1,
    spreadBase: 0.15,
    heatInc: 0.3,
    extinguisherCool: 0.65,
    sprinklerCool: 0,
    sprinklerFireQuench: 0,
    wetDryChance: 0.06,
    flareChance: 0.02,
    spawnEveryTicks: 8,
    scoreMultiplier: 1.15,
  },
  {
    id: "chemical",
    labelEn: "Chemical",
    labelAr: "كيميائي",
    hintEn: "Unstable flare-ups. Sprinklers are expensive and less effective.",
    hintAr: "اشتعالات مفاجئة. الرشاشات أغلى وأقل فعالية.",
    allowSprinkler: true,
    sprinklerCost: 4,
    extinguisherCost: 1,
    spreadBase: 0.12,
    heatInc: 0.28,
    extinguisherCool: 0.6,
    sprinklerCool: 0.14,
    sprinklerFireQuench: 0.22,
    wetDryChance: 0.12,
    flareChance: 0.06,
    spawnEveryTicks: 7,
    scoreMultiplier: 1.25,
  },
];

function idx(x: number, y: number) {
  return y * GRID + x;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function pickScenario(id: ScenarioId) {
  return SCENARIOS.find((s) => s.id === id) || SCENARIOS[0];
}

export default function FireSafetyChallenge() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("Fire Safety Challenge | Meteory", "تحدي السلامة من الحريق | Meteory");
  const description = t(
    "An intuitive endless firefighting mini-game — tap to contain the spread and climb the leaderboard.",
    "لعبة لا نهائية سهلة — اضغط لإيقاف الانتشار وادخل لوحة الشرف."
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const placeRef = useRef<(x: number, y: number) => void>(() => {});

  const [scenarioId, setScenarioId] = useState<ScenarioId>("standard");
  const scenario = useMemo(() => pickScenario(scenarioId), [scenarioId]);

  const [grid, setGrid] = useState<Tile[]>(() =>
    Array.from({ length: GRID * GRID }, () => ({ state: "empty", heat: 0 }))
  );

  const [running, setRunning] = useState(false);
  const [budget, setBudget] = useState(12);
  const [tool, setTool] = useState<"extinguisher" | "sprinkler">("extinguisher");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [tick, setTick] = useState(0);

  const [name, setName] = useState("");
  const [leaders, setLeaders] = useState<Array<{ id: number; name: string; score: number; created_at: string }>>([]);

  const heatMap = useMemo(() => {
    let fire = 0;
    for (const c of grid) if (c.state === "fire") fire++;
    return { fire };
  }, [grid]);

  const scenarioIcon = (id: ScenarioId) => {
    if (id === "electrical") return <Zap className="h-4 w-4" />;
    if (id === "chemical") return <FlaskConical className="h-4 w-4" />;
    return <Flame className="h-4 w-4" />;
  };

  const reset = () => {
    setGrid(Array.from({ length: GRID * GRID }, () => ({ state: "empty", heat: 0 })));
    setBudget(12);
    setScore(0);
    setCombo(0);
    setLives(3);
    setTick(0);
    setRunning(false);
    if (!scenario.allowSprinkler) setTool("extinguisher");
  };

  const place = (x: number, y: number) => {
    if (!running) return;
    if (tool === "sprinkler" && !scenario.allowSprinkler) return;

    setGrid((g) => {
      const ng = g.map((c) => ({ ...c }));
      const c = ng[idx(x, y)];

      // Intuitive: If you click a burning tile with extinguisher, it immediately cools it.
      if (tool === "extinguisher") {
        if (c.state === "fire") {
          const cost = scenario.extinguisherCost;
          if (budget < cost) return g;
          c.heat -= 1.2;
          setBudget((b) => b - cost);
          setCombo((k) => k + 1);
          setScore((s) => s + Math.round((10 + kClamp(combo, 0, 20)) * scenario.scoreMultiplier));
          if (c.heat <= 0) {
            c.state = "wet";
            c.heat = 0;
          }
          return ng;
        }

        if (c.state === "empty" || c.state === "wet") {
          const cost = scenario.extinguisherCost;
          if (budget < cost) return g;
          c.state = "extinguisher";
          c.heat = 0;
          setBudget((b) => b - cost);
          setCombo(0);
          return ng;
        }

        return g;
      }

      // sprinkler tool
      if (c.state !== "empty" && c.state !== "wet") return g;
      const cost = scenario.sprinklerCost;
      if (budget < cost) return g;
      c.state = "sprinkler";
      c.heat = 0;
      setBudget((b) => b - cost);
      setCombo(0);
      return ng;
    });
  };

  // helper: avoid TS capture bugs
  function kClamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
  }

  // keep latest place() available to Babylon pointer handler
  useEffect(() => {
    placeRef.current = (x, y) => place(x, y);
  });

  // Scene init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene = new Scene(engine);
    scene.clearColor = Color3.FromHexString("#ffffff").toColor4(1);
    sceneRef.current = scene;

    const cam = new ArcRotateCamera("cam", Math.PI / 4, Math.PI / 3, 18, new Vector3(0, 0, 0), scene);
    cam.attachControl(canvas, true);
    cam.lowerRadiusLimit = 10;
    cam.upperRadiusLimit = 28;

    new HemisphericLight("h", new Vector3(0.1, 1, 0.2), scene);

    scene.onPointerDown = (_evt, pick) => {
      const m = pick?.pickedMesh;
      if (!m) return;
      if (!m.name.startsWith("tile_")) return;
      const parts = m.name.split("_");
      const x = Number(parts[1]);
      const y = Number(parts[2]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      placeRef.current(x, y);
    };

    engine.runRenderLoop(() => scene.render());
    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      scene.dispose();
      engine.dispose();
      engineRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  // Visual rebuild
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const existing = scene.meshes.filter((m) => m.name.startsWith("tile_"));
    existing.forEach((m) => m.dispose());

    const size = 0.95;
    const offset = (GRID - 1) / 2;

    for (let y = 0; y < GRID; y++) {
      for (let x = 0; x < GRID; x++) {
        const c = grid[idx(x, y)];
        const box = MeshBuilder.CreateBox(`tile_${x}_${y}`, { size }, scene);
        box.position = new Vector3(x - offset, 0, y - offset);

        const m = new StandardMaterial(`m_${x}_${y}`, scene);
        m.specularColor = Color3.Black();

        if (c.state === "fire") {
          m.diffuseColor = Color3.FromHexString("#7f1d1d");
          m.emissiveColor = Color3.FromHexString("#ef4444").scale(0.65);
        } else if (c.state === "wet") {
          m.diffuseColor = Color3.FromHexString("#0b1a2b").scale(0.75);
          m.emissiveColor = Color3.FromHexString("#3b82f6").scale(0.25);
        } else if (c.state === "extinguisher") {
          m.diffuseColor = Color3.FromHexString("#111827");
          m.emissiveColor = Color3.FromHexString("#22c55e").scale(0.25);
        } else if (c.state === "sprinkler") {
          m.diffuseColor = Color3.FromHexString("#0b1a2b");
          m.emissiveColor = Color3.FromHexString("#22c55e").scale(0.18);
        } else {
          m.diffuseColor = Color3.FromHexString("#f1f5f9");
        }

        box.material = m;
      }
    }
  }, [grid]);

  // Endless loop
  useEffect(() => {
    if (!running) return;

    let localTick = 0;
    setTick(0);

    // seed initial fire
    setGrid((g) => {
      const ng = g.map((c) => ({ ...c }));
      const x = 2 + Math.floor(Math.random() * (GRID - 4));
      const y = 2 + Math.floor(Math.random() * (GRID - 4));
      ng[idx(x, y)].state = "fire";
      ng[idx(x, y)].heat = 1;
      return ng;
    });

    const tickId = setInterval(() => {
      localTick += 1;
      setTick(localTick);

      setGrid((g) => {
        const ng = g.map((c) => ({ ...c }));

        const neighbors = (x: number, y: number) =>
          [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
          ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < GRID && ny < GRID) as Array<[number, number]>;

        // random flare-ups
        if (Math.random() < scenario.flareChance) {
          const x = 1 + Math.floor(Math.random() * (GRID - 2));
          const y = 1 + Math.floor(Math.random() * (GRID - 2));
          const c = ng[idx(x, y)];
          if (c.state === "empty") {
            c.state = "fire";
            c.heat = 1;
          }
        }

        // periodic new ignition to keep it endless
        if (localTick % scenario.spawnEveryTicks === 0) {
          const x = 1 + Math.floor(Math.random() * (GRID - 2));
          const y = 1 + Math.floor(Math.random() * (GRID - 2));
          const c = ng[idx(x, y)];
          if (c.state === "empty") {
            c.state = "fire";
            c.heat = 1;
          }
          // budget trickle keeps the loop additive
        }

        // sprinkler effect
        for (let y = 0; y < GRID; y++) {
          for (let x = 0; x < GRID; x++) {
            const c = ng[idx(x, y)];
            if (c.state === "sprinkler") {
              for (const [nx, ny] of neighbors(x, y)) {
                const n = ng[idx(nx, ny)];
                if (n.state === "fire") {
                  n.heat -= scenario.sprinklerFireQuench;
                } else if (n.state === "empty") {
                  n.state = "wet";
                  n.heat = 0;
                }
              }
            }
          }
        }

        // fire spread + cooling
        let fireCount = 0;
        for (let y = 0; y < GRID; y++) {
          for (let x = 0; x < GRID; x++) {
            const c = ng[idx(x, y)];
            if (c.state === "fire") {
              fireCount++;
              c.heat += scenario.heatInc;

              for (const [nx, ny] of neighbors(x, y)) {
                const n = ng[idx(nx, ny)];
                if (n.state === "wet") continue;
                if (n.state === "extinguisher") {
                  c.heat -= scenario.extinguisherCool;
                  continue;
                }
                if (n.state === "sprinkler") {
                  c.heat -= scenario.sprinklerCool;
                  continue;
                }
                const chance = scenario.spreadBase + clamp(c.heat, 0, 2) * 0.06;
                if (n.state === "empty" && Math.random() < chance) {
                  n.state = "fire";
                  n.heat = 1;
                }
              }

              if (c.heat <= 0) {
                c.state = "wet";
                c.heat = 0;
              }
            } else if (c.state === "wet") {
              if (Math.random() < scenario.wetDryChance) c.state = "empty";
            }
          }
        }

        // If it gets out of control, lose a life (but never hard stop score)
        if (fireCount >= 24) {
          setLives((hp) => {
            const next = hp - 1;
            if (next <= 0) {
              setRunning(false);
              toast.error(t("Overrun — submit your score!", "تم فقد السيطرة — أرسل نتيجتك!"));
              return 0;
            }
            toast.message(t("Fire is escalating — contain it!", "الحريق يتصاعد — سيطر عليه!"));
            return next;
          });

          // big wet pulse to recover (keeps it playable)
          for (let i = 0; i < ng.length; i++) {
            if (ng[i].state === "fire" && Math.random() < 0.5) {
              ng[i].state = "wet";
              ng[i].heat = 0;
            }
          }
        }

        // additive baseline score + budget regen
        setScore((s) => s + Math.max(1, Math.round((3 + (24 - fireCount) * 0.08) * scenario.scoreMultiplier)));
        setBudget((b) => Math.min(18, b + 0.2));

        return ng;
      });
    }, TICK_MS);

    return () => clearInterval(tickId);
  }, [running, scenario]);

  // scenario change safety
  useEffect(() => {
    if (!running) return;
    setRunning(false);
    toast.message(
      t(
        "Scenario changed — run paused. Reset to start with new rules.",
        "تم تغيير السيناريو — تم إيقاف الجولة. اضغط إعادة للبدء بالقواعد الجديدة."
      )
    );
  }, [scenarioId]);

  const fetchLeaders = async () => {
    try {
      const r = await fetch("/api/leaderboard");
      const j = await r.json();
      if (j.success) setLeaders(j.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const submitScore = async () => {
    const safeName = name.trim();
    if (!safeName) return toast.error(t("Enter your name", "اكتب اسمك"));

    try {
      const r = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: safeName, score: Math.floor(score) }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error || "failed");
      toast.success(t("Score submitted!", "تم إرسال النتيجة"));
      await fetchLeaders();
    } catch (e: any) {
      toast.error(e?.message || t("Could not submit score", "تعذر إرسال النتيجة"));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/game" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">{t("Interactive Training", "تدريب تفاعلي")}</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t("Fire Safety Challenge", "تحدي السلامة من الحريق")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t(
              "Endless and intuitive: tap burning tiles to cool them, build zones, and keep the facility under control.",
              "لا نهائية وسهلة: اضغط على مربع مشتعل لإخماده، كوّن مناطق حماية، وسيطر على المكان."
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/systems-lab">
                {t("See how systems work", "شاهد كيف تعمل الأنظمة")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <div className="ml-auto flex flex-wrap gap-2 items-center">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("Scenario", "سيناريو")}</div>
              {SCENARIOS.map((s) => (
                <Button
                  key={s.id}
                  variant={scenarioId === s.id ? "default" : "outline"}
                  className="rounded-md"
                  onClick={() => {
                    setScenarioId(s.id);
                    if (s.id === "electrical") setTool("extinguisher");
                  }}
                  disabled={running}
                  title={language === "ar" ? s.hintAr : s.hintEn}
                >
                  {scenarioIcon(s.id)}
                  {language === "ar" ? s.labelAr : s.labelEn}
                </Button>
              ))}
            </div>

            <div className="w-full text-xs text-muted-foreground mt-2">{language === "ar" ? scenario.hintAr : scenario.hintEn}</div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 grid lg:grid-cols-[1.25fr_0.75fr] gap-10">
        <div className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <Flame className="h-4 w-4" /> {t("Facility Grid", "خريطة الموقع")}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="inline-flex items-center gap-2">
                    {scenarioIcon(scenarioId)} {language === "ar" ? scenario.labelAr : scenario.labelEn}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <HeartPulse className="h-4 w-4" /> {t("Lives", "محاولات")}: {lives}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4" /> {t("Budget", "ميزانية")}: {Math.floor(budget)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" /> {t("Score", "النتيجة")}: {Math.floor(score)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <canvas ref={canvasRef} className="w-full h-[420px] bg-white" />
              <div className="p-4 border-t border-border bg-white">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={tool === "extinguisher" ? "default" : "outline"}
                      className="rounded-md"
                      onClick={() => setTool("extinguisher")}
                      disabled={!running}
                    >
                      <Shield className="h-4 w-4" /> {t("Extinguisher", "طفاية")} ({scenario.extinguisherCost})
                    </Button>
                    <Button
                      variant={tool === "sprinkler" ? "default" : "outline"}
                      className="rounded-md"
                      onClick={() => setTool("sprinkler")}
                      disabled={!running || !scenario.allowSprinkler}
                      title={!scenario.allowSprinkler ? t("Not available for electrical fires", "غير متاح لحرائق الكهرباء") : undefined}
                    >
                      <Droplets className="h-4 w-4" /> {t("Sprinkler", "رشاش")} ({scenario.allowSprinkler ? scenario.sprinklerCost : "—"})
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {!running ? (
                      <Button className="rounded-md" onClick={() => setRunning(true)}>
                        {t("Start", "ابدأ")}
                      </Button>
                    ) : (
                      <Button variant="outline" className="rounded-md" onClick={() => setRunning(false)}>
                        {t("Pause", "إيقاف")}
                      </Button>
                    )}
                    <Button variant="outline" className="rounded-md" onClick={reset}>
                      {t("Reset", "إعادة")}
                    </Button>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground flex items-start gap-2">
                  <MousePointerClick className="h-4 w-4 mt-0.5" />
                  <span>
                    {t(
                      "Tap a burning tile with Extinguisher to cool it. Use Sprinklers to create slow zones. The game is endless and your score always increases.",
                      "اضغط على مربع مشتعل بالطفاية لإخماده. استخدم الرشاشات لتكوين مناطق بطيئة. اللعبة لا نهائية والنتيجة تزيد دائماً."
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Submit score", "إرسال النتيجة")}</div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("Your name", "اسمك")} className="max-w-sm" />
              <div className="text-sm font-semibold">{t("Score", "النتيجة")}: {Math.floor(score)}</div>
              <Button className="rounded-md" onClick={submitScore} disabled={running}>
                {t("Submit", "إرسال")}
              </Button>
              <div className="text-xs text-muted-foreground">
                {running ? t("Pause to submit.", "أوقف الجولة للإرسال.") : t("Leaderboard updates instantly.", "اللوحة تتحدث فوراً.")}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <Trophy className="h-4 w-4" /> {t("Leaderboard", "لوحة الشرف")}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaders.length === 0 ? (
                <div className="text-sm text-muted-foreground">{t("No scores yet.", "لا توجد نتائج بعد.")}</div>
              ) : (
                leaders.slice(0, 15).map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between border border-border rounded-md px-3 py-2">
                    <div className="text-sm font-semibold">#{i + 1} {r.name}</div>
                    <div className="text-sm font-bold text-primary">{r.score}</div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Why this exists", "لماذا هذه اللعبة")}</div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "A lightweight, intuitive loop that teaches: different hazards require different tactics.",
                "حلقة لعب بسيطة توضح أن كل خطر يحتاج تكتيك مختلف."
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
