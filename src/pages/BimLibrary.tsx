import Seo from "@/components/Seo";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";

const SOURCES = [
  {
    titleEn: "ARCAT  Fire Protection BIM Library",
    titleAr: "مكتبة BIM للحماية من الحريق (ARCAT)",
    descEn: "Free manufacturer BIM objects (Revit/DWG) across fire protection categories.",
    descAr: "مكتبة مجانية لملفات BIM (Revit/DWG) في مجال الحماية من الحريق.",
    url: "https://www.arcat.com/content-type/bim/specialties-10/fire-protection-specialties-104400",
  },
  {
    titleEn: "Cla-Val Revit files (valves)",
    titleAr: "ملفات Revit لصمامات (Cla-Val)",
    descEn: "Examples of how global manufacturers publish Revit families and keep them searchable.",
    descAr: "مثال لكيف تنشر الشركات العالمية ملفات Revit بشكل منظم وقابل للبحث.",
    url: "https://www.cla-val.com/resources/revit-files",
  },
  {
    titleEn: "Aquestia BIM",
    titleAr: "BIM (Aquestia)",
    descEn: "High-quality BIM objects (LOD-focused) and lightweight downloads.",
    descAr: "ملفات BIM عالية الجودة (تركيز LOD) وتنزيلات خفيفة.",
    url: "https://www.aquestia.com/tools/bim/",
  },
];

export default function BimLibrary() {
  const { language } = useLanguage();
  const t = (en: string, ar: string) => (language === "ar" ? ar : en);

  const title = t("BIM  CAD Library | Meteory", "مكتبة BIM و CAD | Meteory");
  const description = t(
    "Download-ready BIM/CAD resources and a request workflow for project-specific submittals.",
    "مصادر BIM/CAD جاهزة للتنزيل مع نظام طلب ملفات حسب المشروع."
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/bim-library" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">{t("Engineering Resources", "موارد هندسية")}</div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t("BIM / CAD Library", "مكتبة BIM / CAD")}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t(
              "We publish and organize engineering resources in a way procurement teams and consultants can actually use. If a specific Revit family is required for approvals, request it and we’ll prepare a model-specific deliverable.",
              "ننشر الموارد الهندسية بطريقة عملية للمشتريات والاستشاريين. إذا كان مطلوب ملف Revit محدد للاعتماد، اطلبه وسنجهزه حسب الموديل."
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/contact">
                {t("Request CAD/BIM", "اطلب CAD/BIM")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="/products">
                {t("Browse products", "المنتجات")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-14 grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("Whats available now", "المتاح الآن")}</div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "Today we provide: datasheets, submittal-ready product info, and a structured request path for CAD/Revit/IFC deliverables.",
                  "نوفر حالياً: PDF بيانات فنية + معلومات تجهيز ملفات الاعتماد، ومسار طلب منظم لملفات CAD/Revit/IFC."
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-4 bg-white">
                  <div className="font-semibold">{t("Datasheets (PDF)", "داتا شيت (PDF)")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t("Per model", "حسب الموديل")}</div>
                </div>
                <div className="rounded-md border border-border p-4 bg-white">
                  <div className="font-semibold">{t("Submittal pack", "ملف اعتماد")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t("Schedule + references", "جدول معدات + مراجع")}</div>
                </div>
                <div className="rounded-md border border-border p-4 bg-white">
                  <div className="font-semibold">{t("CAD / DWG (on request)", "CAD / DWG (عند الطلب)")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t("Project-specific", "حسب المشروع")}</div>
                </div>
                <div className="rounded-md border border-border p-4 bg-white">
                  <div className="font-semibold">{t("Revit / IFC (on request)", "Revit / IFC (عند الطلب)")}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t("Model-specific", "حسب الموديل")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {SOURCES.map((s) => (
              <Card key={s.url} className="rounded-none border-border/60 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-lg font-heading font-bold">{t(s.titleEn, s.titleAr)}</div>
                  <div className="text-sm text-muted-foreground mt-2">{t(s.descEn, s.descAr)}</div>
                </CardHeader>
                <CardContent>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    <Button className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                      {t("Open source", "فتح المصدر")}
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("How to request", "طريقة الطلب")}</div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <div>{t("Send:", "أرسل:")}</div>
              <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-1">
                <li>{t("City (AHJ)", "المدينة (الجهة المختصة)")}</li>
                <li>{t("Project type  occupancy", "نوع المنشأة")}</li>
                <li>{t("Drawings if available (PDF/DWG)", "المخططات إن وجدت")}</li>
                <li>{t("Requested format (DWG, RVT, IFC)", "الصيغة المطلوبة")}</li>
              </ul>
              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/contact">
                    {t("Request files", "اطلب الملفات")}
                    <Download className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                {t(
                  "Note: We only publish files we can stand behind. External libraries are referenced for convenience.",
                  "ملاحظة: ننشر فقط ملفات يمكننا ضمانها. مصادر خارجية مذكورة للتسهيل."
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
