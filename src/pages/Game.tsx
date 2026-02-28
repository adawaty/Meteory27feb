import { useEffect, useMemo, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trophy, Flame, Droplets, Shield, Timer, ArrowRight, MousePointerClick } from "lucide-react";
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

const GRID = 11;
const TICK_MS = 420;

function idx(x: number, y: number) {
  return y * GRID + x;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function FireSafetyChallenge() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("Fire Safety Challenge | Meteory", "تحدي السلامة من الحريق | Meteory");
  const description = t(
    "A fast, tactical firefighting mini-game — stop the spread and climb the leaderboard.",
    "لعبة تكتيكية سريعة — امنع انتشار الحريق وادخل لوحة الشرف."
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const placeRef = useRef<(x: number, y: number) => void>(() => {});

  const [grid, setGrid] = useState<Tile[]>(() =>
    Array.from({ length: GRID * GRID }, () => ({ state: "empty", heat: 0 }))
  );
  const [running, setRunning] = useState(false);
  const [budget, setBudget] = useState(12);
  const [timeLeft, setTimeLeft] = useState(60);
  const [tool, setTool] = useState<"extinguisher" | "sprinkler">("extinguisher");
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [leaders, setLeaders] = useState<Array<{ id: number; name: string; score: number; created_at: string }>>([]);

  const heatMap = useMemo(() => {
    let fire = 0;
    let protectedTiles = 0;
    for (const c of grid) {
      if (c.state === "fire") fire++;
      if (c.state === "wet" || c.state === "sprinkler" || c.state === "extinguisher") protectedTiles++;
    }
    return { fire, protectedTiles };
  }, [grid]);

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

  // Build/Update tile visuals
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // dispose previous
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

  // Game loop
  useEffect(() => {
    if (!running) return;

    // seed one fire at start
    setGrid((g) => {
      const ng = g.map((c) => ({ ...c }));
      const x = 2 + Math.floor(Math.random() * (GRID - 4));
      const y = 2 + Math.floor(Math.random() * (GRID - 4));
      ng[idx(x, y)].state = "fire";
      ng[idx(x, y)].heat = 1;
      return ng;
    });

    let tickId: any;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          clearInterval(timerId);
          clearInterval(tickId);
          setRunning(false);
          toast.success(t("Run complete. Submit your score!", "انتهت الجولة. أرسل نتيجتك!"));
        }
        return next;
      });
    }, 1000);

    tickId = setInterval(() => {
      setGrid((g) => {
        const ng = g.map((c) => ({ ...c }));

        const neighbors = (x: number, y: number) =>
          [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
          ].filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < GRID && ny < GRID) as Array<[number, number]>;

        // sprinkler effect: wet adjacent
        for (let y = 0; y < GRID; y++) {
          for (let x = 0; x < GRID; x++) {
            const c = ng[idx(x, y)];
            if (c.state === "sprinkler") {
              for (const [nx, ny] of neighbors(x, y)) {
                const n = ng[idx(nx, ny)];
                if (n.state === "fire") {
                  n.heat -= 0.7;
                } else if (n.state === "empty") {
                  n.state = "wet";
                  n.heat = 0;
                }
              }
            }
          }
        }

        // fire spread + cooling
        for (let y = 0; y < GRID; y++) {
          for (let x = 0; x < GRID; x++) {
            const c = ng[idx(x, y)];
            if (c.state === "fire") {
              c.heat += 0.25;
              for (const [nx, ny] of neighbors(x, y)) {
                const n = ng[idx(nx, ny)];
                if (n.state === "wet") continue;
                if (n.state === "extinguisher") {
                  c.heat -= 0.45;
                  continue;
                }
                if (n.state === "sprinkler") {
                  c.heat -= 0.3;
                  continue;
                }
                if (n.state === "empty" && Math.random() < 0.12 + clamp(c.heat, 0, 2) * 0.06) {
                  n.state = "fire";
                  n.heat = 1;
                }
              }
              if (c.heat <= 0) {
                c.state = "wet";
                c.heat = 0;
              }
            } else if (c.state === "wet") {
              if (Math.random() < 0.08) c.state = "empty";
            }
          }
        }

        const fireCount = ng.reduce((acc, c) => acc + (c.state === "fire" ? 1 : 0), 0);
        setScore((s) => s + Math.max(0, 8 - fireCount));

        return ng;
      });
    }, TICK_MS);

    return () => {
      clearInterval(timerId);
      clearInterval(tickId);
    };
  }, [running]);

  const reset = () => {
    setGrid(Array.from({ length: GRID * GRID }, () => ({ state: "empty", heat: 0 })));
    setBudget(12);
    setTimeLeft(60);
    setScore(0);
    setRunning(false);
  };

  const place = (x: number, y: number) => {
    if (!running) return;
    setGrid((g) => {
      const ng = g.map((c) => ({ ...c }));
      const c = ng[idx(x, y)];
      if (c.state !== "empty" && c.state !== "wet") return g;

      const cost = tool === "extinguisher" ? 1 : 3;
      if (budget < cost) return g;

      c.state = tool;
      c.heat = 0;
      setBudget((b) => b - cost);
      return ng;
    });
  };

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
        body: JSON.stringify({ name: safeName, score }),
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
              "Tactical mini-game: contain the spread using the right tools. Built to feel like a fast engineering decision loop.",
              "لعبة تكتيكية: امنع انتشار الحريق باستخدام الأدوات المناسبة. فكرة اللعبة تحاكي قرارات سريعة بشكل هندسي."
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/systems-lab">
                {t("See how systems work", "شاهد كيف تعمل الأنظمة")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 grid lg:grid-cols-[1.25fr_0.75fr] gap-10">
        <div className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <Flame className="h-4 w-4" /> {t("Fire spread simulator", "محاكاة انتشار الحريق")}
                </div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="inline-flex items-center gap-2"><Timer className="h-4 w-4" /> {timeLeft}s</span>
                  <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4" /> {t("Budget", "ميزانية")}: {budget}</span>
                  <span className="inline-flex items-center gap-2"><Flame className="h-4 w-4" /> {t("Fire", "حريق")}: {heatMap.fire}</span>
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
                      <Shield className="h-4 w-4" /> {t("Extinguisher (1)", "طفاية (1)")}
                    </Button>
                    <Button
                      variant={tool === "sprinkler" ? "default" : "outline"}
                      className="rounded-md"
                      onClick={() => setTool("sprinkler")}
                      disabled={!running}
                    >
                      <Droplets className="h-4 w-4" /> {t("Sprinkler (3)", "رشاش (3)")}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {!running ? (
                      <Button className="rounded-md" onClick={() => setRunning(true)}>
                        {t("Start run", "ابدأ")}
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
                      "Click a tile to place your selected tool. Tip: place sprinklers to slow spread, then use extinguishers to finish hotspots.",
                      "اضغط على أي مربع لوضع الأداة المختارة. نصيحة: ضع الرشاشات لتقليل الانتشار ثم استخدم الطفايات لإطفاء البؤر."
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
              <div className="text-sm font-semibold">{t("Score", "النتيجة")}: {score}</div>
              <Button className="rounded-md" onClick={submitScore} disabled={running}>
                {t("Submit", "إرسال")}
              </Button>
              <div className="text-xs text-muted-foreground">
                {running ? t("Pause/finish the run to submit.", "أوقف/أنه الجولة للإرسال.") : t("Leaderboard updates instantly.", "اللوحة تتحدث فوراً.")}
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
                "A fun way to teach the idea of layered protection: detection, suppression, and the right tool in the right place — fast.",
                "طريقة ممتعة لتوضيح مفهوم الحماية متعددة الطبقات: كشف، إخماد، والأداة المناسبة في المكان المناسب بسرعة."
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
