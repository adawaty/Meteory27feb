import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";

const SITE_URL = "https://meteory-eg.com";

export default function CodeArticleWarehouseTenthRamadan() {
  const { language } = useLanguage();

  const title =
    language === "ar"
      ? "اشتراطات الحماية من الحريق لمخزن/مستودع في مدينة العاشر من رمضان (قائمة عملية) | Meteory"
      : "Fire Code Checklist for a Warehouse in 10th of Ramadan City (Practical Pack) | Meteory";

  const description =
    language === "ar"
      ? "قائمة عملية لتجهيز ملف الاعتماد وتقليل الملاحظات المتكررة لمخزن أو مستودع صناعي في مدينة العاشر من رمضان."
      : "A practical compliance pack outline for industrial warehouses in 10th of Ramadan City to reduce approval iterations.";

  const canonicalPath = "/codes/warehouse-10th-of-ramadan";

  const faq =
    language === "ar"
      ? [
          {
            q: "ما الذي يطلبه التفتيش عادةً للمستودعات؟",
            a: "مسارات هروب واضحة، إنذار فعال، مكافحة مناسبة لنوع التخزين، وترتيب تخزين يقلل خطر الانتشار—مع ملف مستندات مرتب.",
          },
          {
            q: "هل تختلف الاشتراطات حسب نوع البضائع؟",
            a: "نعم. تختلف حسب قابلية الاشتعال، ارتفاعات التخزين، وطريقة الرص. يجب تحديد نوع المخزون بدقة قبل اختيار الحل.",
          },
          {
            q: "هل يمكن البدء قبل زيارة الموقع؟",
            a: "نعم. اجمع البيانات الأساسية (المساحة، الارتفاع، نوع التخزين، المدينة) ثم نجهز قائمة بنود مبدئية، وبعدها يتم التأكيد على المخطط/المعاينة.",
          },
        ]
      : [
          {
            q: "What do inspectors focus on for warehouses?",
            a: "Clear egress, effective alarm, suppression suitable for the stored commodity, and storage housekeeping—backed by a clean documentation pack.",
          },
          {
            q: "Do requirements change based on stored goods?",
            a: "Yes. Commodity, storage height, and racking/stacking method change the hazard profile and the protection approach.",
          },
          {
            q: "Can we start before a site visit?",
            a: "Yes. Share basics (area, clear height, storage type, city) to draft a starter pack, then validate on plan / site survey.",
          },
        ];

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: language === "ar" ? "ar" : "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${canonicalPath}`,
    },
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
            {language === "ar"
              ? "اشتراطات الحماية من الحريق لمستودع في العاشر من رمضان (قائمة عملية)"
              : "Warehouse Fire Code Checklist — 10th of Ramadan City"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "قائمة تخطيطية لتجهيز ملف الاعتماد وتقليل الزيارات المتكررة. راجع دائماً الجهة المختصة والاستشاري المعتمد."
              : "Planning guidance to prepare a compliance pack and reduce back-and-forth. Always validate with the AHJ and a licensed consultant."}
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
              {language === "ar" ? "1) حدد نوع التخزين" : "1) Define the storage hazard"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "قبل اختيار المعدات، حدد: نوع البضائع (قابلة للاشتعال/غير)، ارتفاع التخزين، الرص/الرفوف، ومساحات التحميل والتفريغ."
                : "Before selecting equipment, define: commodity type, storage height, racking/stacking method, and loading/unloading zones."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "2) جهّز حزمة المستندات" : "2) Prepare a documentation pack"}
            </h2>
            <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 text-muted-foreground space-y-2">
              <li>{language === "ar" ? "مخطط عام + مخارج + مسافات" : "General plan + exits + key travel distances"}</li>
              <li>{language === "ar" ? "تحديد مناطق التخزين وخطوط الحركة" : "Storage zoning and traffic flow"}</li>
              <li>{language === "ar" ? "جدول معدات وداتا شيت" : "Equipment schedule + datasheets"}</li>
              <li>{language === "ar" ? "خطة صيانة/اختبار وتسجيل" : "Testing/maintenance plan and recordkeeping"}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "3) أخطاء شائعة" : "3) Common pitfalls"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[ 
                {
                  titleEn: "Overlooking egress and aisle widths",
                  titleAr: "إهمال مسارات الهروب وعرض الممرات",
                  bodyEn: "Protection can be sized correctly but still fail inspection if egress is blocked or unclear.",
                  bodyAr: "قد تكون المعدات مناسبة لكن يرفض الملف بسبب إعاقة المخارج أو عدم وضوح المسارات.",
                },
                {
                  titleEn: "No clarity on stored commodity",
                  titleAr: "عدم وضوح نوع المخزون",
                  bodyEn: "Hazard classification changes design decisions. Document what is stored and how.",
                  bodyAr: "تصنيف الخطورة يغير قرارات التصميم. وثّق ما يتم تخزينه وطريقة التخزين.",
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

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "4) خطوة عملية" : "4) Practical next step"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "ابنِ طلب عرض سعر واحد يشمل البنود والكميات—ثم سنراجع المخطط ونؤكد التفاصيل قبل التوريد."
                : "Build one quote request with items + quantities—then we validate on plan and confirm before supply."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                <Link href="/build-quote">
                  {language === "ar" ? "ابدأ الآن" : "Start now"}
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
                  <div className="font-semibold">{language === "ar" ? "ما الذي نحتاجه منك؟" : "What we need from you"}</div>
                  <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-1">
                    <li>{language === "ar" ? "المدينة" : "City"}</li>
                    <li>{language === "ar" ? "نوع المخزون وطريقة التخزين" : "Stored commodity + storage method"}</li>
                    <li>{language === "ar" ? "الارتفاعات والمساحة" : "Clear height + area"}</li>
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
                  ? "تحذير: هذه المقالة إرشادية للتخطيط وليست فتوى هندسية أو قانونية."
                  : "Note: This article is planning guidance, not engineering or legal advice."}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
