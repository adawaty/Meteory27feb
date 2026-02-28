import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMetallicRoughnessMaterial,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";

type SystemId = "fm200" | "co2" | "kitchen" | "sprinkler" | "foam";

type Step = {
  id: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  focus: (scene: Scene) => void;
};

function makeGlowMaterial(scene: Scene, color: Color3) {
  const m = new StandardMaterial("glow", scene);
  m.emissiveColor = color;
  m.diffuseColor = color.scale(0.25);
  m.specularColor = Color3.Black();
  return m;
}

function metal(scene: Scene) {
  const m = new PBRMetallicRoughnessMaterial("metal", scene);
  m.baseColor = new Color3(0.82, 0.85, 0.9);
  m.metallic = 0.9;
  m.roughness = 0.2;
  return m;
}

function pipeMat(scene: Scene) {
  const m = new PBRMetallicRoughnessMaterial("pipe", scene);
  m.baseColor = Color3.FromHexString("#0b1a2b");
  m.metallic = 0.6;
  m.roughness = 0.35;
  return m;
}

function accent(scene: Scene) {
  const m = new PBRMetallicRoughnessMaterial("accent", scene);
  m.baseColor = Color3.FromHexString("#dc2626");
  m.metallic = 0.2;
  m.roughness = 0.35;
  return m;
}

function buildSystem(scene: Scene, system: SystemId) {
  const root = new TransformNode("root", scene);

  const mats = {
    metal: metal(scene),
    pipe: pipeMat(scene),
    accent: accent(scene),
    glow: makeGlowMaterial(scene, Color3.FromHexString("#dc2626")),
    glowBlue: makeGlowMaterial(scene, Color3.FromHexString("#22c55e")),
  };

  const nodes: Record<string, TransformNode | Mesh> = {};

  const addLabelNode = (name: string) => {
    const n = new TransformNode(name, scene);
    n.parent = root;
    nodes[name] = n;
    return n;
  };

  if (system === "fm200") {
    const cyl = MeshBuilder.CreateCylinder("cyl", { height: 2.2, diameterTop: 0.7, diameterBottom: 0.7, tessellation: 36 }, scene);
    cyl.material = mats.metal;
    cyl.position = new Vector3(-1.6, 1.1, 0);
    cyl.parent = root;

    const cyl2 = cyl.clone("cyl2") as Mesh;
    cyl2.position.x = -0.7;

    const valve = MeshBuilder.CreateSphere("valve", { diameter: 0.55 }, scene);
    valve.material = mats.accent;
    valve.position = new Vector3(0.35, 2.2, 0);
    valve.parent = root;

    const pipe = MeshBuilder.CreateTube(
      "pipe",
      {
        path: [
          new Vector3(-1.2, 2.2, 0),
          new Vector3(0.35, 2.2, 0),
          new Vector3(1.8, 2.2, 0),
          new Vector3(2.6, 1.6, 0),
        ],
        radius: 0.12,
        tessellation: 24,
      },
      scene
    );
    pipe.material = mats.pipe;
    pipe.parent = root;

    const nozzle = MeshBuilder.CreateCylinder("nozzle", { height: 0.35, diameter: 0.35, tessellation: 24 }, scene);
    nozzle.material = mats.metal;
    nozzle.position = new Vector3(2.75, 1.35, 0);
    nozzle.rotation = new Vector3(0, 0, Math.PI / 2);
    nozzle.parent = root;

    const panel = MeshBuilder.CreateBox("panel", { width: 0.85, height: 0.5, depth: 0.22 }, scene);
    panel.material = mats.pipe;
    panel.position = new Vector3(1.25, 0.6, -0.75);
    panel.parent = root;

    nodes.cylinders = addLabelNode("cylinders");
    nodes.cylinders.position = new Vector3(-1.1, 1.2, 0);
    nodes.valve = valve;
    nodes.pipe = pipe;
    nodes.nozzle = nozzle;
    nodes.panel = panel;
  }

  if (system === "co2") {
    const bank = MeshBuilder.CreateCylinder("co2_bank", { height: 2.3, diameter: 0.75, tessellation: 36 }, scene);
    bank.material = mats.metal;
    bank.position = new Vector3(-1.2, 1.15, 0);
    bank.parent = root;

    const manifold = MeshBuilder.CreateTube(
      "manifold",
      { path: [new Vector3(-1.2, 2.2, 0), new Vector3(0.6, 2.2, 0), new Vector3(2.0, 1.6, 0)], radius: 0.12, tessellation: 24 },
      scene
    );
    manifold.material = mats.pipe;
    manifold.parent = root;

    const horn = MeshBuilder.CreateCylinder("horn", { height: 0.7, diameterTop: 0.65, diameterBottom: 0.25, tessellation: 24 }, scene);
    horn.material = mats.metal;
    horn.position = new Vector3(2.35, 1.3, 0);
    horn.rotation = new Vector3(0, 0, Math.PI / 2);
    horn.parent = root;

    const pull = MeshBuilder.CreateBox("pull", { width: 0.35, height: 0.6, depth: 0.12 }, scene);
    pull.material = mats.accent;
    pull.position = new Vector3(0.25, 1.5, -0.55);
    pull.parent = root;

    nodes.bank = bank;
    nodes.manifold = manifold;
    nodes.horn = horn;
    nodes.pull = pull;
  }

  if (system === "kitchen") {
    const hood = MeshBuilder.CreateBox("hood", { width: 2.6, height: 0.5, depth: 1.2 }, scene);
    hood.material = mats.metal;
    hood.position = new Vector3(0, 1.8, 0);
    hood.parent = root;

    const duct = MeshBuilder.CreateTube(
      "duct",
      { path: [new Vector3(0.8, 1.8, 0), new Vector3(1.6, 2.4, 0), new Vector3(2.6, 2.4, 0)], radius: 0.14, tessellation: 24 },
      scene
    );
    duct.material = mats.pipe;
    duct.parent = root;

    const tank = MeshBuilder.CreateCylinder("agent", { height: 1.2, diameter: 0.55, tessellation: 24 }, scene);
    tank.material = mats.accent;
    tank.position = new Vector3(-1.6, 0.8, -0.7);
    tank.parent = root;

    const nozzle = MeshBuilder.CreateSphere("k_nozzle", { diameter: 0.22 }, scene);
    nozzle.material = mats.metal;
    nozzle.position = new Vector3(0.2, 1.55, 0.25);
    nozzle.parent = root;

    const manual = MeshBuilder.CreateBox("manual", { width: 0.35, height: 0.6, depth: 0.12 }, scene);
    manual.material = mats.pipe;
    manual.position = new Vector3(-2.1, 1.2, 0.8);
    manual.parent = root;

    nodes.hood = hood;
    nodes.duct = duct;
    nodes.tank = tank;
    nodes.nozzle = nozzle;
    nodes.manual = manual;
  }

  if (system === "sprinkler") {
    const pump = MeshBuilder.CreateBox("pump", { width: 1.0, height: 0.6, depth: 0.8 }, scene);
    pump.material = mats.accent;
    pump.position = new Vector3(-1.7, 0.6, 0);
    pump.parent = root;

    const riser = MeshBuilder.CreateTube(
      "riser",
      { path: [new Vector3(-1.2, 0.6, 0), new Vector3(-0.4, 1.8, 0), new Vector3(1.8, 1.8, 0)], radius: 0.12, tessellation: 24 },
      scene
    );
    riser.material = mats.pipe;
    riser.parent = root;

    const head = MeshBuilder.CreateSphere("head", { diameter: 0.18 }, scene);
    head.material = mats.metal;
    head.position = new Vector3(1.8, 1.6, 0);
    head.parent = root;

    nodes.pump = pump;
    nodes.riser = riser;
    nodes.head = head;
  }

  if (system === "foam") {
    const tank = MeshBuilder.CreateCylinder("foam_tank", { height: 1.8, diameter: 0.9, tessellation: 24 }, scene);
    tank.material = mats.metal;
    tank.position = new Vector3(-1.6, 0.9, 0);
    tank.parent = root;

    const proportioner = MeshBuilder.CreateBox("prop", { width: 0.6, height: 0.4, depth: 0.4 }, scene);
    proportioner.material = mats.accent;
    proportioner.position = new Vector3(-0.2, 1.0, 0);
    proportioner.parent = root;

    const pipe = MeshBuilder.CreateTube(
      "foam_pipe",
      { path: [new Vector3(-1.2, 1.4, 0), new Vector3(-0.2, 1.2, 0), new Vector3(2.2, 1.2, 0)], radius: 0.12, tessellation: 24 },
      scene
    );
    pipe.material = mats.pipe;
    pipe.parent = root;

    const monitor = MeshBuilder.CreateCylinder("monitor", { height: 0.35, diameterTop: 0.5, diameterBottom: 0.3, tessellation: 24 }, scene);
    monitor.material = mats.metal;
    monitor.position = new Vector3(2.4, 1.0, 0);
    monitor.rotation = new Vector3(0, 0, Math.PI / 2);
    monitor.parent = root;

    nodes.tank = tank;
    nodes.proportioner = proportioner;
    nodes.pipe = pipe;
    nodes.monitor = monitor;
  }

  return { root, nodes };
}

function addFlowParticles(scene: Scene, path: Vector3[], color: Color3) {
  const particles: Mesh[] = [];
  const mat = makeGlowMaterial(scene, color);
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = MeshBuilder.CreateSphere(`p_${i}`, { diameter: 0.08 }, scene);
    p.material = mat;
    particles.push(p);
  }

  let t = 0;
  scene.onBeforeRenderObservable.add(() => {
    t += scene.getEngine().getDeltaTime() * 0.00035;
    for (let i = 0; i < particles.length; i++) {
      const u = (t + i / particles.length) % 1;
      const seg = Math.min(path.length - 2, Math.floor(u * (path.length - 1)));
      const local = u * (path.length - 1) - seg;
      const a = path[seg];
      const b = path[seg + 1];
      particles[i].position = Vector3.Lerp(a, b, local);
    }
  });

  return () => {
    particles.forEach((p) => p.dispose());
  };
}

export default function SystemViz3D({ system }: { system: SystemId }) {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = useMemo(() => {
    if (system === "fm200") {
      return [
        {
          id: "detect",
          titleEn: "Detection",
          titleAr: "الكشف",
          bodyEn: "Panel verifies detectors before release.",
          bodyAr: "اللوحة تؤكد الإشارة قبل التشغيل.",
          focus: (scene) => {
            (scene.activeCamera as any)?.setTarget(new Vector3(1.2, 0.7, -0.7));
          },
        },
        {
          id: "release",
          titleEn: "Release",
          titleAr: "التشغيل",
          bodyEn: "Actuation opens valve and releases agent.",
          bodyAr: "تشغيل الصمام وتحرير العامل.",
          focus: (scene) => {
            (scene.activeCamera as any)?.setTarget(new Vector3(0.2, 2.0, 0));
          },
        },
        {
          id: "flow",
          titleEn: "Flow",
          titleAr: "التدفق",
          bodyEn: "Agent travels through engineered pipe network.",
          bodyAr: "العامل يتحرك عبر شبكة المواسير.",
          focus: (scene) => {
            (scene.activeCamera as any)?.setTarget(new Vector3(1.4, 2.0, 0));
          },
        },
      ];
    }
    if (system === "kitchen") {
      return [
        {
          id: "hood",
          titleEn: "Hood   duct",
          titleAr: "الشفاط والدكت",
          bodyEn: "Risk concentrates in hood/duct grease paths.",
          bodyAr: "الخطورة غالباً في الشفاط/الدكت بسبب الدهون.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(0.6, 2.1, 0)),
        },
        {
          id: "agent",
          titleEn: "Agent discharge",
          titleAr: "تفريغ العامل",
          bodyEn: "Nozzles cover plenum and ducts per design.",
          bodyAr: "فوهات تغطي مناطق الطهي ومسار الدكت.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(0.0, 1.6, 0.2)),
        },
      ];
    }
    if (system === "co2") {
      return [
        {
          id: "bank",
          titleEn: "Cylinder bank",
          titleAr: "بنك أسطوانات",
          bodyEn: "CO2 stored and released via manifold.",
          bodyAr: "تخزين CO2 وتوزيعه عبر مانيفولد.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(-0.9, 1.4, 0)),
        },
        {
          id: "discharge",
          titleEn: "Discharge",
          titleAr: "التفريغ",
          bodyEn: "Horns/nozzles direct CO2 to hazard zone.",
          bodyAr: "الهورن/الفوهات توجه CO2 لمنطقة الخطر.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(2.0, 1.4, 0)),
        },
      ];
    }
    if (system === "sprinkler") {
      return [
        {
          id: "supply",
          titleEn: "Water supply",
          titleAr: "مصدر المياه",
          bodyEn: "Pump and riser feed the network.",
          bodyAr: "المضخة والرايزر تغذي الشبكة.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(-1.2, 0.8, 0)),
        },
        {
          id: "heads",
          titleEn: "Sprinkler heads",
          titleAr: "الرؤوس",
          bodyEn: "Heads activate at temperature thresholds.",
          bodyAr: "الرؤوس تعمل عند درجة حرارة محددة.",
          focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(1.6, 1.7, 0)),
        },
      ];
    }
    return [
      {
        id: "mix",
        titleEn: "Proportioning",
        titleAr: "مزج الرغوة",
        bodyEn: "Foam concentrate proportioned into water flow.",
        bodyAr: "تركيز الرغوة يُمزج في خط المياه.",
        focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(-0.2, 1.1, 0)),
      },
      {
        id: "apply",
        titleEn: "Application",
        titleAr: "التطبيق",
        bodyEn: "Monitor/nozzles apply finished foam to hazard.",
        bodyAr: "المدفع/الفوهات تطبق الرغوة على منطقة الخطر.",
        focus: (scene) => (scene.activeCamera as any)?.setTarget(new Vector3(2.3, 1.0, 0)),
      },
    ];
  }, [system, language]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;

    const scene = new Scene(engine);
    scene.clearColor = Color3.FromHexString("#ffffff").toColor4(1);
    sceneRef.current = scene;

    const camera = new ArcRotateCamera(
      "cam",
      Math.PI / 3,
      Math.PI / 3,
      7.5,
      new Vector3(0, 1.3, 0),
      scene
    );
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 4.8;
    camera.upperRadiusLimit = 12;
    camera.wheelDeltaPercentage = 0.01;

    new HemisphericLight("h", new Vector3(0.2, 1, 0.1), scene);

    const ground = MeshBuilder.CreateGround("g", { width: 14, height: 8 }, scene);
    const gMat = new StandardMaterial("gm", scene);
    gMat.diffuseColor = Color3.FromHexString("#f8fafc");
    gMat.specularColor = Color3.Black();
    ground.material = gMat;
    ground.position.y = 0;

    const { root } = buildSystem(scene, system);
    root.position = new Vector3(0, 0, 0);

    // default flow path per system
    let disposeParticles: (() => void) | null = null;
    if (system === "fm200") {
      disposeParticles = addFlowParticles(
        scene,
        [new Vector3(-1.2, 2.2, 0), new Vector3(0.35, 2.2, 0), new Vector3(1.8, 2.2, 0), new Vector3(2.6, 1.6, 0)],
        Color3.FromHexString("#ef4444")
      );
    }
    if (system === "sprinkler") {
      disposeParticles = addFlowParticles(
        scene,
        [new Vector3(-1.7, 0.6, 0), new Vector3(-0.4, 1.8, 0), new Vector3(1.8, 1.8, 0)],
        Color3.FromHexString("#3b82f6")
      );
    }
    if (system === "foam") {
      disposeParticles = addFlowParticles(
        scene,
        [new Vector3(-1.2, 1.4, 0), new Vector3(-0.2, 1.2, 0), new Vector3(2.2, 1.2, 0)],
        Color3.FromHexString("#22c55e")
      );
    }

    engine.runRenderLoop(() => scene.render());

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      disposeParticles?.();
      scene.dispose();
      engine.dispose();
      engineRef.current = null;
      sceneRef.current = null;
    };
  }, [system]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    steps[Math.min(activeStep, steps.length - 1)]?.focus(scene);
  }, [activeStep, steps]);

  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative">
          <canvas ref={canvasRef} className="w-full h-[360px] sm:h-[420px] lg:h-[460px] bg-white" />
          <div className="absolute left-4 top-4 rounded-md bg-white/90 border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest">
            {t("Interactive system animation (planning)", "محاكاة تفاعلية (تخطيطية)")}
          </div>
        </div>

        <div className="p-5 border-t lg:border-t-0 lg:border-l border-border">
          <div className="text-sm font-heading font-bold">
            {system === "fm200" && t("FM-200 Sequence", "تسلسل FM-200")}
            {system === "co2" && t("CO2 System", "نظام CO2")}
            {system === "kitchen" && t("Kitchen Hood System", "نظام مطابخ")}
            {system === "sprinkler" && t("Sprinkler System", "شبكة رش")}
            {system === "foam" && t("Foam System", "نظام رغوة")}
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t(
              "High-fidelity visual explanation for procurement and planning. Final engineering must follow the AHJ and manufacturer design tools.",
              "شرح بصري عالي الجودة للتخطيط وطلب الأسعار. التصميم النهائي يجب أن يتبع الجهة المختصة وبرامج الشركة المصنعة."
            )}
          </p>

          <div className="mt-5 grid gap-2">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "text-left rounded-lg border border-border px-3 py-2",
                  idx === activeStep ? "bg-primary text-primary-foreground border-primary" : "bg-white hover:bg-secondary"
                )}
              >
                <div className="text-sm font-semibold">{t(s.titleEn, s.titleAr)}</div>
                <div className={cn("mt-1 text-xs", idx === activeStep ? "text-primary-foreground/85" : "text-muted-foreground")}> 
                  {t(s.bodyEn, s.bodyAr)}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="rounded-md" onClick={() => setActiveStep((s) => Math.max(0, s - 1))}>
              {t("Back", "السابق")}
            </Button>
            <Button className="rounded-md" onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}>
              {t("Next", "التالي")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
