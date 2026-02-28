import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, FileText, ArrowRight } from "lucide-react";
import { useQuoteCart } from "@/hooks/use-quote-cart";
import { saveLead } from "@/lib/db";
import { Link } from "wouter";

// optional: exportable for later CSV/PDF generation


export default function BuildQuote() {
  const { language } = useLanguage();
  const cartApi = useQuoteCart();
  const items = cartApi.cart.items;

  const [contact, setContact] = useState({ name: "", email: "", phone: "", company: "", city: "" });
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const lines = items.length;
    const qty = items.reduce((n, it) => n + it.qty, 0);
    return { lines, qty };
  }, [items]);

  const submit = async () => {
    if (!items.length) {
      toast.error(language === "ar" ? "أضف عناصر إلى عرض السعر أولاً" : "Add items to the quote first");
      return;
    }
    if (!contact.name || !contact.email) {
      toast.error(language === "ar" ? "الاسم والبريد الإلكتروني مطلوبان" : "Name and email are required");
      return;
    }

    setSaving(true);
    const res = await saveLead({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      app_name: "Build a Quote",
      facility_type: "procurement",
      data: {
        company: contact.company,
        city: contact.city,
        notes,
        items,
        totals,
        source: "build-quote",
      },
      total_units: totals.qty,
    });
    setSaving(false);

    if (res.success) {
      toast.success(language === "ar" ? "تم إرسال طلب عرض السعر ✅" : "Quote request submitted ✅");
      cartApi.clear();
      setNotes("");
      setContact({ name: "", email: "", phone: "", company: "", city: "" });
    } else {
      toast.error(String((res as any).error || (language === "ar" ? "فشل الإرسال" : "Submission failed")));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-secondary py-16 border-b border-border">
        <div className="container px-4">
          <div className="ui-label text-muted-foreground mb-3">
            {language === "ar" ? "مشتريات" : "Procurement"}
          </div>
          <h1 className="text-5xl font-heading font-semibold mb-4">
            {language === "ar" ? "ابنِ عرض سعر" : "Build a Quote"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {language === "ar"
              ? "اجمع المنتجات المطلوبة ثم أرسل طلبًا موحدًا لفريق المبيعات. هذا يقلل وقت المراسلات ويُسرّع التسعير." 
              : "Add multiple products to a single bundled request. This reduces back-and-forth and speeds up accurate pricing."}
          </p>
        </div>
      </div>

      <div className="container px-4 py-16 grid lg:grid-cols-[1.6fr_1fr] gap-10">
        <div className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {language === "ar" ? "عناصر عرض السعر" : "Quote Items"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {language === "ar"
                      ? `${totals.lines} بند • ${totals.qty} إجمالي كمية`
                      : `${totals.lines} lines • ${totals.qty} total qty`}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-none"
                  disabled={!items.length}
                  onClick={() => {
                    cartApi.clear();
                    toast.success(language === "ar" ? "تم تفريغ القائمة" : "Cart cleared");
                  }}
                >
                  {language === "ar" ? "تفريغ" : "Clear"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!items.length ? (
                <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">
                  {language === "ar"
                    ? "لا توجد عناصر. انتقل إلى صفحة المنتجات واضغط “أضف لعرض السعر”."
                    : "No items yet. Go to Products and click “Add to Quote”."}
                  <div className="mt-4">
                    <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                      <Link href="/products">
                        {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="border border-border bg-white p-4 rounded-none">
                    <div className="flex gap-4 items-start">
                      {it.image ? (
                        <img src={it.image} alt={language === "ar" ? it.nameAr || it.name : it.name} className="w-16 h-16 object-contain bg-secondary/40 border border-border p-2" />
                      ) : (
                        <div className="w-16 h-16 bg-secondary/40 border border-border" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-heading font-bold uppercase text-foreground truncate">
                          {language === "ar" ? it.nameAr || it.name : it.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {it.category}{it.subCategory ? ` • ${it.subCategory}` : ""}{it.sku ? ` • ${it.sku}` : ""}
                        </div>

                        <div className="mt-3 grid md:grid-cols-[140px_1fr] gap-3">
                          <div>
                            <Label className="text-xs">{language === "ar" ? "الكمية" : "Qty"}</Label>
                            <Input
                              type="number"
                              min={1}
                              value={it.qty}
                              onChange={(e) => cartApi.setQty(it.id, Number(e.target.value || 1))}
                              className="h-10"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{language === "ar" ? "ملاحظات على البند (اختياري)" : "Line notes (optional)"}</Label>
                            <Input
                              value={it.notes || ""}
                              onChange={(e) => cartApi.setNotes(it.id, e.target.value)}
                              placeholder={language === "ar" ? "مثل: لون، سعة، اشتراطات…" : "e.g., capacity, finish, compliance…"}
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => cartApi.remove(it.id)}
                        className="shrink-0"
                        aria-label={language === "ar" ? "حذف" : "Remove"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {language === "ar" ? "ملاحظات عامة" : "General Notes"}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px]"
                placeholder={language === "ar" ? "مثال: موعد المعاينة، مخطط الموقع، UL/FM للمضخات…" : "Example: inspection deadline, site plan, UL/FM pumps…"}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {language === "ar" ? "بيانات التواصل" : "Contact"}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{language === "ar" ? "الاسم" : "Full name"}</Label>
                <Input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "الهاتف" : "Phone"}</Label>
                <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "الشركة (اختياري)" : "Company (optional)"}</Label>
                <Input value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "المدينة (اختياري)" : "City (optional)"}</Label>
                <Input value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} className="h-11" />
              </div>

              <Button
                onClick={submit}
                disabled={saving}
                className="w-full rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest h-12"
              >
                {saving
                  ? language === "ar" ? "جارٍ الإرسال…" : "Submitting…"
                  : language === "ar" ? "إرسال طلب عرض السعر" : "Submit bundled request"}
                <FileText className="h-4 w-4" />
              </Button>

              <div className="text-xs text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? "سيصل الطلب لفريق المبيعات كطلب واحد يتضمن جميع البنود والكميات." 
                  : "Your request will reach the sales team as a single bundle with all lines and quantities."}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
