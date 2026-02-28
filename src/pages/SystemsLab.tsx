import { useLanguage } from "@/contexts/LanguageContext";
import Seo from "@/components/Seo";
import SystemViz3D from "@/components/SystemViz3D";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemsLab() {
  const { language } = useLanguage();

  const title = language === "ar" ? "معمل الأنظمة | Meteory" : "Systems Lab | Meteory";
  const description =
    language === "ar"
      ? "شرح بصري تفاعلي لأنظمة الإطفاء للتخطيط وطلب الأسعار."
      : "High-fidelity interactive visualizations of firefighting systems for planning and procurement.";

  return (
    <div className="min-h-screen bg-background pb-24">
      <Seo title={title} description={description} canonicalPath="/systems-lab" />

      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">
            {language === "ar" ? "معمل الأنظمة" : "Systems Lab"}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            {language === "ar" ? "شرح تفاعلي للأنظمة" : "Premium Interactive System Visualizations"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "شرح بسيط ومرئي لكيف يعمل كل نظام. مناسب لغير المهندسين لفهم الصورة العامة قبل طلب عرض سعر."
              : "Plain-language, visual walkthroughs of how each system works — designed so non-engineers can understand the environment before requesting a quote."}
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border border-border bg-background px-4 py-3">
              <div className="font-semibold">{language === "ar" ? "1) اختر النظام" : "1) Pick a system"}</div>
              <div className="text-muted-foreground mt-1">{language === "ar" ? "FM-200 أو CO2 أو رشاشات..." : "FM-200, CO2, sprinklers, etc."}</div>
            </div>
            <div className="rounded-md border border-border bg-background px-4 py-3">
              <div className="font-semibold">{language === "ar" ? "2) اتبع الخطوات" : "2) Follow the steps"}</div>
              <div className="text-muted-foreground mt-1">{language === "ar" ? "اضغط على الخطوة لرؤية ما يحدث" : "Tap a step to see what happens"}</div>
            </div>
            <div className="rounded-md border border-border bg-background px-4 py-3">
              <div className="font-semibold">{language === "ar" ? "3) ابدأ عرض السعر" : "3) Build a quote"}</div>
              <div className="text-muted-foreground mt-1">{language === "ar" ? "اختر المنتجات المناسبة" : "Choose the right products"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <Tabs defaultValue="fm200">
          <TabsList className="w-full flex flex-wrap justify-start">
            <TabsTrigger value="fm200">FM-200</TabsTrigger>
            <TabsTrigger value="co2">CO2</TabsTrigger>
            <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
            <TabsTrigger value="sprinkler">Sprinkler</TabsTrigger>
            <TabsTrigger value="foam">Foam</TabsTrigger>
          </TabsList>

          <TabsContent value="fm200" className="mt-6">
            <SystemViz3D system="fm200" />
          </TabsContent>
          <TabsContent value="co2" className="mt-6">
            <SystemViz3D system="co2" />
          </TabsContent>
          <TabsContent value="kitchen" className="mt-6">
            <SystemViz3D system="kitchen" />
          </TabsContent>
          <TabsContent value="sprinkler" className="mt-6">
            <SystemViz3D system="sprinkler" />
          </TabsContent>
          <TabsContent value="foam" className="mt-6">
            <SystemViz3D system="foam" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
