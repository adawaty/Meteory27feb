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
              ? "هذه محاكاة بصرية للتخطيط فقط وليست بديلاً عن تصميم هندسي معتمد."
              : "These are planning-grade visual explanations (not a substitute for engineered design / AHJ approval)."}
          </p>
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
