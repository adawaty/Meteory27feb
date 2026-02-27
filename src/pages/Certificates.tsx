import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileDown, ShieldCheck, Mail } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";

export default function Certificates() {
  const { language } = useLanguage();

  const mailto = (subject: string) =>
    `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <h1 className="text-5xl font-heading font-bold uppercase mb-4">
            {language === "ar" ? "الشهادات" : "Certificates"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "صفحة مخصصة لمراجعي الجودة والمشتريات. اطلب النسخ الرسمية المختومة عبر البريد أو نموذج التواصل."
              : "A procurement-friendly hub for compliance packs. Request official stamped copies via email or the contact form."}
          </p>
        </div>
      </div>

      <div className="container px-4 py-16 grid lg:grid-cols-2 gap-10">
        <Card className="rounded-none border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 border border-border">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold uppercase">
                  {language === "ar" ? "الامتثال والجودة" : "Compliance & Quality"}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "ar"
                    ? "نقدم حزم اعتماد حسب نوع المنتج ومتطلبات المشروع."
                    : "We provide certification packs per product line and project requirements."}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">ISO 9001:2015</Badge>
              <Badge variant="secondary">UL / FM</Badge>
              <Badge variant="secondary">
                {language === "ar" ? "مضخات وملحقات" : "Pumps & accessories"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground leading-relaxed">
              {language === "ar"
                ? "ملاحظة: اعتماد UL/FM ينطبق على خط المضخات والملحقات. يمكنكم طلب ملفات الاعتماد الرسمية وفقاً للموديل المطلوب."
                : "Note: UL/FM applies to the pumps & accessories line. Request the official certificates pack based on your required model."}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                <a href={mailto(language === "ar" ? "طلب شهادات الاعتماد" : "Request certificates pack")}
                  target="_blank"
                  rel="noreferrer"
                >
                  {language === "ar" ? "اطلب حزمة الشهادات" : "Request certificates"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="rounded-none">
                <a href={`mailto:${COMPANY_INFO.email}`} target="_blank" rel="noreferrer">
                  {language === "ar" ? "راسلنا" : "Email us"}
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 border border-border">
                <FileDown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold uppercase">
                  {language === "ar" ? "حزمة المستندات" : "Submittal Pack"}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "ar"
                    ? "يمكننا تجهيز حزمة مشروع تشمل الداتا شيت، الشهادات، والمرفقات المطلوبة." 
                    : "We can assemble a project-ready submittal pack (datasheets, certificates, attachments)."}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 rtl:pl-0 rtl:pr-5">
              <li>{language === "ar" ? "داتا شيت حسب الموديل" : "Model-specific datasheets"}</li>
              <li>{language === "ar" ? "شهادات (حسب خط المنتج)" : "Certificates (per product line)"}</li>
              <li>{language === "ar" ? "مرفقات وملحقات" : "Attachments & accessories"}</li>
              <li>{language === "ar" ? "خطاب اعتماد/تسليم" : "Delivery / compliance letters"}</li>
            </ul>

            <Button asChild variant="outline" className="rounded-none">
              <a href={mailto(language === "ar" ? "طلب حزمة Submittal" : "Request submittal pack")}
                target="_blank"
                rel="noreferrer"
              >
                {language === "ar" ? "اطلب حزمة Submittal" : "Request submittal pack"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
