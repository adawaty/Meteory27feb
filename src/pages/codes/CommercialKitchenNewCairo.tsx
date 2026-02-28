import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";

const SITE_URL = "https://meteory-eg.com";

export default function CodeArticleCommercialKitchenNewCairo() {
  const { language } = useLanguage();

  const title =
    language === "ar"
      ? "متطلبات الحماية من الحريق لمطبخ تجاري/مطعم في التجمع (قائمة عملية) | Meteory"
      : "Fire Protection Checklist for a Commercial Kitchen in New Cairo (Practical Pack) | Meteory";

  const description =
    language === "ar"
      ? "قائمة عملية لتجهيز ملف الاعتماد لمطابخ تجارية: شفاطات، مخاطر زيوت، إنذار، مخارج، وتوثيق." 
      : "A practical checklist for commercial kitchens: hood/duct risk, cooking oil hazards, alarms, egress, and documentation.";

  const canonicalPath = "/codes/commercial-kitchen-new-cairo";

  const faq =
    language === "ar"
      ? [
          { q: "هل يكفي طفايات فقط للمطبخ؟", a: "غالباً لا. المطابخ تحتاج منهج متعدد: طفايات مناسبة، إنذار، وإجراءات تشغيل—وأحياناً حلول إخماد لمنطقة الطهي حسب التصميم والجهة المختصة." },
          { q: "ما الذي يسبب رفض الملف غالباً؟", a: "غياب التفاصيل (نوع الطهي/الشفاطات/قنوات الدكت)، أو عدم وضوح مخارج الهروب، أو مستندات ناقصة." },
          { q: "هل يمكن البدء بقائمة مشتريات؟", a: "نعم. اذكر مساحة المطبخ ونوع المعدات والمدينة وسنقترح قائمة مبدئية ثم نؤكد على المخطط." },
        ]
      : [
          { q: "Are portable extinguishers enough for a commercial kitchen?", a: "Often not. Kitchens typically need a layered approach: suitable extinguishers, alarms, operational controls—and sometimes local suppression depending on layout and AHJ." },
          { q: "What commonly causes rejections?", a: "Missing details (cooking type, hood/duct routes), unclear egress, or incomplete documentation." },
          { q: "Can we start with a procurement list?", a: "Yes. Share kitchen area, equipment type, and city to draft a starter list, then confirm on plan." },
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
            {language === "ar" ? "متطلبات الحماية من الحريق لمطبخ تجاري/مطعم في التجمع" : "Commercial Kitchen Fire Protection — New Cairo"}
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
              {language === "ar" ? "1) حدد نوع الطهي ومصادر الحرارة" : "1) Define cooking type and heat sources"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "الخطورة تتغير حسب: زيوت/قلي، شوايات، أفران، غاز/كهرباء، ومسار الدكت. وثّق ذلك في الملف."
                : "Hazard profile changes based on: frying oils, grills, ovens, gas/electric, and hood/duct routing. Document this clearly."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "2) ملف مستندات مختصر" : "2) A tight documentation pack"}
            </h2>
            <ul className="list-disc pl-5 rtl:pl-0 rtl:pr-5 text-muted-foreground space-y-2">
              <li>{language === "ar" ? "مخطط المطبخ + مواقع معدات الطهي" : "Kitchen plan + cooking equipment locations"}</li>
              <li>{language === "ar" ? "مسار الشفاط/الدكت ونقاط التنظيف" : "Hood/duct route + cleaning access points"}</li>
              <li>{language === "ar" ? "جدول معدات + داتا شيت" : "Equipment schedule + datasheets"}</li>
              <li>{language === "ar" ? "خطة تنظيف وصيانة للدكت" : "Duct cleaning & maintenance plan"}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-heading font-bold">
              {language === "ar" ? "3) أخطاء شائعة" : "3) Common pitfalls"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[ 
                {
                  titleEn: "No clarity on hood/duct routing",
                  titleAr: "عدم وضوح مسار الدكت",
                  bodyEn: "Approvals stall when the duct route and access points are not shown on plan.",
                  bodyAr: "يتأخر الاعتماد عندما لا يكون مسار الدكت ونقاط الوصول واضحة على المخطط.",
                },
                {
                  titleEn: "Missing operational controls",
                  titleAr: "غياب الإجراءات التشغيلية",
                  bodyEn: "Housekeeping and cleaning plans matter because grease buildup increases risk.",
                  bodyAr: "خطط النظافة والتنظيف مهمة لأن تراكم الدهون يزيد الخطورة.",
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
                    <li>{language === "ar" ? "المدينة والمنطقة" : "City/area"}</li>
                    <li>{language === "ar" ? "نوع المطبخ ومعدات الطهي" : "Kitchen type + cooking equipment"}</li>
                    <li>{language === "ar" ? "المساحة" : "Area"}</li>
                    <li>{language === "ar" ? "مخطط إن توفر" : "Plan if available"}</li>
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
