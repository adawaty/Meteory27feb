import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, FileDown, ShieldCheck, Calculator, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import companyProfilePdf from "@/assets/datasheets/Meteory_Company_profile.pdf";
import cabinetsCatalogPdf from "@/assets/datasheets/Cabinets.pdf";
import attachmentsPdf from "@/assets/datasheets/Attachments.pdf";

function downloadWithToast(url: string, name: string) {
  const id = toast.loading(`Preparing ${name}…`);
  // Trigger download/open immediately.
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => toast.success(`${name} opened`, { id }), 650);
}

function downloadWithToastAr(url: string, name: string) {
  const id = toast.loading(`جارٍ فتح ${name}…`);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => toast.success(`تم فتح ${name}`, { id }), 650);
}

export default function Resources() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <h1 className="text-5xl font-heading font-bold uppercase mb-4">
            {language === "ar" ? "الموارد" : "Resources"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "مكتبة مرجعية سريعة للفرق الهندسية والمشتريات. يمكنكم طلب الملفات الرسمية أو الكتالوجات عبر نموذج التواصل." 
              : "A quick reference library for engineering and procurement teams. Request official files or catalogs via the contact form."}
          </p>
        </div>
      </div>

      <div className="container px-4 py-16 space-y-14">
        {/* Procurement Hub cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Company Profile */}
          <Card className="rounded-none border-border/60 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 border border-border">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold uppercase">
                    {language === "ar" ? "نبذة عن الشركة" : "Company Profile"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === "ar"
                      ? "ملف رسمي للمشتريات يتضمن القدرات وخطوط الإنتاج." 
                      : "Procurement-ready overview of capabilities and manufacturing."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    language === "ar"
                      ? downloadWithToastAr(companyProfilePdf, "نبذة عن الشركة")
                      : downloadWithToast(companyProfilePdf, "Company Profile")
                  }
                  className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest"
                >
                  {language === "ar" ? "تحميل PDF" : "Download PDF"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/contact">
                    {language === "ar" ? "اطلب نسخة مختومة" : "Request stamped copy"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card className="rounded-none border-border/60 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 border border-border">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold uppercase">
                    {language === "ar" ? "الشهادات" : "Certificates"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === "ar"
                      ? "حزم اعتماد حسب خط المنتج (UL/FM للمضخات والملحقات)." 
                      : "Compliance packs per product line (UL/FM for pumps & accessories)."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  {language === "ar" ? "ISO 9001:2015 • UL/FM" : "ISO 9001:2015 • UL/FM"}
                </span>
              </div>
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                <Link href="/certificates">
                  {language === "ar" ? "افتح صفحة الشهادات" : "Open Certificates"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Datasheets */}
          <Card className="rounded-none border-border/60 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 border border-border">
                  <FileDown className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold uppercase">
                    {language === "ar" ? "الداتا شيت" : "Datasheets"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === "ar"
                      ? "كتالوجات وملفات فنية جاهزة للاعتماد." 
                      : "Model-ready technical PDFs for consultants and site engineers."}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    language === "ar"
                      ? downloadWithToastAr(cabinetsCatalogPdf, "كتالوج الدواليب")
                      : downloadWithToast(cabinetsCatalogPdf, "Cabinets Catalog")
                  }
                  className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest"
                >
                  {language === "ar" ? "كتالوج الدواليب" : "Cabinets Catalog"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() =>
                    language === "ar"
                      ? downloadWithToastAr(attachmentsPdf, "ملحقات")
                      : downloadWithToast(attachmentsPdf, "Attachments")
                  }
                  variant="outline"
                  className="rounded-none"
                >
                  {language === "ar" ? "ملحقات" : "Attachments"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/products">
                    {language === "ar" ? "كل الداتا شيت" : "All product datasheets"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engineering tools CTA */}
        <div className="bg-foreground text-background p-10 border border-border">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-3xl font-heading font-bold uppercase flex items-center gap-3">
                <Calculator className="h-6 w-6 text-primary" />
                {language === "ar" ? "أدوات هندسية" : "Engineering Tools"}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                {language === "ar"
                  ? "حاسبة سريعة تساعدكم على تحديد عدد الأجهزة اطفاء حريق المبدئي وتجهيز طلب عرض سعر." 
                  : "A fast sizing tool to estimate extinguisher quantities and generate a quote-ready request."}
              </p>
            </div>
            <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
              <Link href="/calculator">
                {language === "ar" ? "افتح الأدوات" : "Open tools"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
