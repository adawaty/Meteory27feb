import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";

const SITE_URL = "https://meteory-eg.com";

export default function CodeArticleLogisticsWarehouseAlexandria() {
  const { language } = useLanguage();

  const title =
    language === "ar"
      ? "متطلبات الحماية من الحريق لمخزن لوجستي في الإسكندرية (قائمة عملية) | Meteory"
      : "Fire Code Checklist for a Logistics Warehouse in Alexandria (Practical Pack) | Meteory";

  const description =
    language === "ar"
      ? "قائمة عملية للمخازن اللوجستية: تخزين، تحميل/تفريغ، إنذار، ومسارات هروب—مع ملف مستندات مرتب." 
      : "A practical planning checklist for logistics warehouses: storage, loading bays, alarms, and egress—plus a clean document pack.";

  const canonicalPath = "/codes/logistics-warehouse-alexandria";

  const faq =
    language === "ar"
      ? [
          { q: "هل مناطق التحميل والتفريغ لها اشتراطات خاصة؟", a: "عادةً يتم التركيز على فصل المخاطر، وضوح المسارات، وخطة التعامل مع مخاطر الكهرباء والوقود—حسب طبيعة التشغيل والجهة المختصة." },
          { q: "ما البيانات الأساسية لبدء التسعير؟", a: "المساحة، الارتفاع الصافي، نوع التخزين، نوع البضائع، وعدد المخارج." },
          { q: "هل تختلف المتطلبات مع التخزين على رفوف عالية؟", a: "نعم. ارتفاع التخزين وطريقة الرص تؤثر على تصنيف الخطورة والحل المناسب." },
        ]
      : [
          { q: "Do loading bays have special considerations?", a: "Often yes. Approvals focus on hazard separation, clear egress, and operational risks (electricity/fuel) depending on the facility and AHJ." },
          { q: "What do you need to start quoting?", a: "Area, clear height, storage type, commodity, and number/locations of exits." },
          { q: "Do high-rack warehouses change requirements?", a: "Yes. Storage height and stacking method affect hazard classification and protection approach." },
        ];

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: language === "ar" ? "ar" : "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${canonicalPath}` },
    author: { "@type": "Organization", name: "Meteory", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Meteory", url: SITE_URL },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath={canonicalPath} jsonLd={[jsonLdArticle, jsonLdFaq]} />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">
            {language === "ar" ? "الأكواد والمعايير" : "Codes & Standards"}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {language === "ar" ? "متطلبات الحماية من الحريق لمخزن لوجستي في الإسكندرية" : "Logistics Warehouse Fire Code Checklist — Alexandria"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "قائمة تخطيطية لتجهيز ملف الاعتماد وتقليل الملاحظات المتكررة. راجع دائماً الجهة المختصة والاستشاري المعتمد."
              : "Planning guidance to prepare a compliance pack and reduce approval iterations. Always validate with the AHJ and a licensed consultant."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/build-quote">
                {language === "ar" ? "ابنِ عرض سعر" : "Build a Quote"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="/codes">
                {language === "ar" ? "العودة للأكواد" : "Back to Codes"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-16 grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "1) افهم تشغيل المخزن" : "1) Map warehouse operations"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "حدد مناطق الاستلام والشحن، حركة الأوناش/الرافعات، ونقاط الشحن الكهربائي (إن وجدت)."
                : "Define receiving/shipping bays, forklift routes, and any EV/forklift charging areas (if applicable)."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "2) ملف مستندات" : "2) Documentation pack"}
            </h2>
            <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 text-muted-foreground space-y-2">
              <li>{language === "ar" ? "مخطط + مخارج ومسارات" : "Plan + exits and egress paths"}</li>
              <li>{language === "ar" ? "تقسيم مناطق التخزين" : "Storage zoning"}</li>
              <li>{language === "ar" ? "جدول معدات + داتا شيت" : "Equipment schedule + datasheets"}</li>
              <li>{language === "ar" ? "خطة صيانة واختبار" : "Testing/maintenance plan"}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "3) أخطاء شائعة" : "3) Common pitfalls"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[ 
                {
                  titleEn: "Ignoring loading bay hazards",
                  titleAr: "إهمال مخاطر مناطق التحميل",
                  bodyEn: "High-activity zones need clear marking, egress, and operational controls.",
                  bodyAr: "المناطق عالية الحركة تحتاج تنظيم ومسارات واضحة وضوابط تشغيلية.",
                },
                {
                  titleEn: "No clarity on storage height",
                  titleAr: "عدم وضوح ارتفاعات التخزين",
                  bodyEn: "Storage height and method affect protection approach and documentation requirements.",
                  bodyAr: "ارتفاع التخزين وطريقة الرص تؤثر على الحل والمستندات المطلوبة.",
                },
              ].map((b) => (
                <Card key={b.titleEn} className="rounded-none border-border/60 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-50 text-amber-800 border border-amber-100 p-2">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{language === "ar" ? b.titleAr : b.titleEn}</div>
                        <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{language === "ar" ? b.bodyAr : b.bodyEn}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{language === "ar" ? "أرسل لنا" : "Send us"}</div>
                  <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-1">
                    <li>{language === "ar" ? "المدينة" : "City"}</li>
                    <li>{language === "ar" ? "المساحة والارتفاع" : "Area + clear height"}</li>
                    <li>{language === "ar" ? "نوع البضائع" : "Commodity"}</li>
                    <li>{language === "ar" ? "طريقة التخزين" : "Storage method"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">
                {language === "ar" ? "تحذير: هذه المقالة إرشادية للتخطيط وليست فتوى هندسية أو قانونية." : "Note: This article is planning guidance, not engineering or legal advice."}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
