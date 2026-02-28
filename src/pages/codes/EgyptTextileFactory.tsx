import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function CodeArticleTextileFactoryEgypt() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">
            {language === "ar" ? "الأكواد والمعايير" : "Codes & Standards"}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {language === "ar"
              ? "اشتراطات الحماية من الحريق لمصنع نسيج في مصر (قائمة عملية)"
              : "Fire Code Requirements for a Textile Factory in Egypt (Practical Checklist)"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "هذه قائمة تخطيطية تساعدك على تجهيز ملف الاعتماد وتقليل الزيارات المتكررة. راجع دائماً الجهة المختصة والاستشاري المعتمد."
              : "A planning checklist to prepare a compliance pack and reduce back-and-forth. Always validate with the AHJ and a licensed consultant."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/build-quote">
                {language === "ar" ? "ابنِ عرض سعر" : "Build a Quote"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none">
              <Link href="/products">
                {language === "ar" ? "المنتجات" : "Products"}
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
              {language === "ar" ? "1) افهم عقلية التفتيش" : "1) Understand the inspection mindset"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "مصانع النسيج تُعامل كمخاطر صناعية بسبب قابلية الاشتعال والغبار والألياف ومناطق التخزين. هدف التفتيش هو: مسارات هروب واضحة، إخماد مناسب، إنذار فعال، وتوثيق كامل."
                : "Textile facilities are treated as higher-risk industrial occupancies due to flammable materials, lint/dust, and storage. Inspectors typically look for: clear egress, adequate suppression, effective alarm, and complete documentation."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "2) جهّز حزمة المستندات (Submittal)" : "2) Prepare a submittal/document pack"}
            </h2>
            <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 text-muted-foreground space-y-2">
              <li>{language === "ar" ? "مخطط معماري مع أبعاد ومسارات هروب" : "Architectural plan with dimensions and egress paths"}</li>
              <li>{language === "ar" ? "تقسيم مناطق الخطورة ومناطق التخزين" : "Hazard zoning and storage areas mapping"}</li>
              <li>{language === "ar" ? "قائمة المعدات + الداتا شيت لكل موديل" : "Equipment schedule + datasheets per model"}</li>
              <li>{language === "ar" ? "شهادات الجودة/الاعتماد (حسب خط المنتج)" : "Certificates (per product line, where applicable)"}</li>
              <li>{language === "ar" ? "تقارير الاختبار والصيانة (إن وجدت)" : "Testing/maintenance records (if existing systems)"}</li>
            </ul>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "ملاحظة: التفاصيل الدقيقة تختلف حسب المدينة والجهة المختصة ونوع النشاط داخل المصنع."
                : "Note: specifics vary by city, AHJ requirements, and the facility’s exact operations."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "3) أخطاء شائعة تؤخر الاعتماد" : "3) Common issues that delay approval"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[ 
                {
                  icon: AlertTriangle,
                  titleEn: "Under-sizing and missing coverage",
                  titleAr: "تقدير أقل من المطلوب / تغطية ناقصة",
                  bodyEn: "Relying on rough counts without validating travel distance and layout. Use the calculator as a start, then validate on plan.",
                  bodyAr: "الاعتماد على أرقام عامة بدون التحقق من التوزيع ومسافة الوصول. ابدأ بالحاسبة ثم راجع المخطط.",
                },
                {
                  icon: AlertTriangle,
                  titleEn: "No documentation trail",
                  titleAr: "نقص في المستندات",
                  bodyEn: "Missing datasheets, approvals, or unclear model references. Keep a single organized pack.",
                  bodyAr: "غياب الداتا شيت/الشهادات أو عدم وضوح الموديلات. جهّز ملف واحد منظم.",
                },
                {
                  icon: AlertTriangle,
                  titleEn: "Ignoring housekeeping and dust controls",
                  titleAr: "إهمال التحكم بالغبار والنظافة",
                  bodyEn: "Lint and dust can raise ignition and spread risk. Consider operational controls alongside equipment.",
                  bodyAr: "الغبار والألياف تزيد احتمالات الاشتعال والانتشار. ضع ضوابط تشغيلية بجانب المعدات.",
                },
                {
                  icon: AlertTriangle,
                  titleEn: "Unclear responsibility for maintenance",
                  titleAr: "عدم وضوح مسؤولية الصيانة",
                  bodyEn: "Inspectors often ask how systems will be tested, refilled, and recorded.",
                  bodyAr: "غالباً سيتم السؤال عن الاختبارات وإعادة التعبئة وسجلات الصيانة.",
                },
              ].map((b) => {
                const I = b.icon;
                return (
                  <Card key={b.titleEn} className="rounded-none border-border/60 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-amber-50 text-amber-800 border border-amber-100 p-2">
                          <I className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {language === "ar" ? b.titleAr : b.titleEn}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            {language === "ar" ? b.bodyAr : b.bodyEn}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "4) خطوة عملية: ابنِ عرض سعر منظم" : "4) Practical next step: build a clean quote request"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "أفضل طريقة لتقليل المراسلات: اجمع البنود والكميات في طلب واحد مع ملاحظات."
                : "The fastest way to reduce back-and-forth: send one bundled request with quantities and clear notes."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                <Link href="/build-quote">
                  {language === "ar" ? "ابدأ الآن" : "Start now"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-none">
                <Link href="/calculator">
                  {language === "ar" ? "استخدم الأدوات" : "Use engineering tools"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
                  <div className="font-semibold">
                    {language === "ar" ? "ما الذي نحتاجه منك؟" : "What we need from you"}
                  </div>
                  <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-1">
                    <li>{language === "ar" ? "المدينة" : "City"}</li>
                    <li>{language === "ar" ? "نوع النشاط داخل المصنع" : "Factory operations (what you produce)"}</li>
                    <li>{language === "ar" ? "المساحة وعدد الأدوار" : "Area and floors"}</li>
                    <li>{language === "ar" ? "مخطط الموقع إن توفر" : "Site plan if available"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground">
                {language === "ar"
                  ? "تحذير قانوني: هذه المقالة إرشادية للتخطيط وليست فتوى هندسية أو قانونية."
                  : "Legal note: This article is planning guidance, not engineering or legal advice."}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
