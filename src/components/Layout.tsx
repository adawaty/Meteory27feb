import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Phone, Mail, Globe, Facebook, Linkedin, ChevronDown, ShoppingCart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY_INFO } from "@/data/company";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteCart } from "@/hooks/use-quote-cart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import logoFullEn from "@/assets/branding/meteory-logo-full-en.png";
import logoFullAr from "@/assets/branding/meteory-logo-full-ar.png";
import AIAssistantWidget from "@/components/AIAssistantWidget";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  // Keep primary navigation procurement-focused.
  // Move About/Projects under a single Company menu to reduce cognitive load.
  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.products"), href: "/products" },
    { label: t("nav.industries"), href: "/industries" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.resources"), href: "/resources" },
    { label: language === "ar" ? "مكتبة BIM" : "BIM Library", href: "/bim-library" },
    { label: language === "ar" ? "معمل الأنظمة" : "Systems Lab", href: "/systems-lab" },
    { label: language === "ar" ? "الألعاب" : "Games", href: "/games" },
    { label: t("nav.tools"), href: "/calculator" },
    { label: language === "ar" ? "الأكواد" : "Codes", href: "/codes" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const cartApi = useQuoteCart();
  const [mobileQuery, setMobileQuery] = useState("");

  const mobileItems = useMemo(() => {
    const base = [
      { section: "primary", label: t("nav.home"), href: "/" },
      { section: "catalog", label: t("nav.products"), href: "/products" },
      { section: "catalog", label: t("nav.industries"), href: "/industries" },
      { section: "services", label: t("nav.services"), href: "/services" },
      { section: "services", label: language === "ar" ? "معمل الأنظمة" : "Systems Lab", href: "/systems-lab" },
      { section: "services", label: language === "ar" ? "مكتبة BIM" : "BIM Library", href: "/bim-library" },
      { section: "services", label: language === "ar" ? "الألعاب" : "Games", href: "/games" },
      { section: "tools", label: t("nav.tools"), href: "/calculator" },
      { section: "tools", label: language === "ar" ? "الأكواد" : "Codes", href: "/codes" },
      { section: "company", label: t("nav.about"), href: "/about" },
      { section: "company", label: t("nav.projects"), href: "/projects" },
      { section: "company", label: t("nav.contact"), href: "/contact" },
    ];

    const q = mobileQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((it) => it.label.toLowerCase().includes(q));
  }, [language, mobileQuery, t]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Top Bar - Industrial Info */}
      <div className="bg-secondary text-foreground py-2 px-4 text-[11px] font-medium hidden md:flex justify-between items-center">
        <span>{t("nav.compliance")}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-2" dir="ltr"><Phone className="h-3 w-3" /> {COMPANY_INFO.phones.mobile}</span>
          <span className="flex items-center gap-2"><Mail className="h-3 w-3" /> {COMPANY_INFO.email}</span>
        </div>
      </div>

      <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2 rtl:ml-6 rtl:mr-0">
           {/* Use real logo instead of text */}
           <img src={language === "ar" ? logoFullAr : logoFullEn} alt="Meteory Fire Safety" width={220} height={56} className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-5 rtl:space-x-reverse text-[15px] font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground",
                location === item.href ? "text-foreground ui-underline-red font-semibold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Company dropdown (reduces nav noise) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                  location === "/about" || location === "/projects" ? "text-foreground ui-underline-red font-semibold" : "text-muted-foreground"
                )}
              >
                {t("nav.company")} <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem asChild>
                <Link href="/about">{t("nav.about")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/projects">{t("nav.projects")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="rounded-full w-8 h-8"
            title={language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">Toggle Language</span>
          </Button>

          <Button asChild variant="ghost" className="rounded-full" title={language === "ar" ? "عرض عرض السعر" : "View quote"}>
            <Link href="/build-quote" className="inline-flex items-center gap-2">
              <span className="relative inline-flex">
                <ShoppingCart className="h-5 w-5" />
                {cartApi.count > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                    {cartApi.count}
                  </span>
                )}
              </span>
              <span className="hidden lg:inline text-sm font-semibold">{t("common.buildQuote")}</span>
            </Link>
          </Button>

          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 rounded-md font-semibold">
            <Link href="/quote">{t("nav.quote")}</Link>
          </Button>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="rounded-full w-8 h-8"
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Quote cart is critical on mobile (was missing) */}
          <Button asChild variant="ghost" size="icon" className="rounded-full w-9 h-9" title={language === "ar" ? "عرض عرض السعر" : "View quote"}>
            <Link href="/build-quote" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartApi.count > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                  {cartApi.count}
                </span>
              )}
              <span className="sr-only">{t("common.buildQuote")}</span>
            </Link>
          </Button>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 p-4">
              <div className="grid gap-3 pb-4 border-b border-border/60">
                <Button asChild className="rounded-none bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest">
                  <Link href="/build-quote" onClick={() => setIsOpen(false)}>
                    {t("common.buildQuote")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none">
                  <Link href="/quote" onClick={() => setIsOpen(false)}>
                    {t("nav.quote")}
                  </Link>
                </Button>
              </div>

              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    placeholder={language === "ar" ? "بحث…" : "Search…"}
                    className="pl-9 rounded-md"
                  />
                </div>
              </div>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="catalog">
                  <AccordionTrigger>{language === "ar" ? "المنتجات" : "Catalog"}</AccordionTrigger>
                  <AccordionContent className="grid">
                    {mobileItems
                      .filter((i) => i.section === "catalog")
                      .map((i) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-medium tracking-wide hover:text-primary block py-2"
                        >
                          {i.label}
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="services">
                  <AccordionTrigger>{language === "ar" ? "الخدمات" : "Services"}</AccordionTrigger>
                  <AccordionContent className="grid">
                    {mobileItems
                      .filter((i) => i.section === "services")
                      .map((i) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-medium tracking-wide hover:text-primary block py-2"
                        >
                          {i.label}
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tools">
                  <AccordionTrigger>{language === "ar" ? "الأدوات" : "Tools"}</AccordionTrigger>
                  <AccordionContent className="grid">
                    {mobileItems
                      .filter((i) => i.section === "tools")
                      .map((i) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-medium tracking-wide hover:text-primary block py-2"
                        >
                          {i.label}
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="company">
                  <AccordionTrigger>{t("nav.company")}</AccordionTrigger>
                  <AccordionContent className="grid">
                    {mobileItems
                      .filter((i) => i.section === "company")
                      .map((i) => (
                        <Link
                          key={i.href}
                          href={i.href}
                          onClick={() => setIsOpen(false)}
                          className="text-base font-medium tracking-wide hover:text-primary block py-2"
                        >
                          {i.label}
                        </Link>
                      ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {mobileQuery.trim() && mobileItems.length === 0 && (
                <div className="text-sm text-muted-foreground">{language === "ar" ? "لا توجد نتائج" : "No matches"}</div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
      <AIAssistantWidget />
    </>
  );
}

export function Footer() {
  const { t, language } = useLanguage();
  return (
    <footer className="bg-[#0b1a2b] text-background py-16">
      <div className="container px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <img src={language === "ar" ? logoFullAr : logoFullEn} alt="Meteory" width={240} height={64} className="h-16 w-auto object-contain bg-white/10 p-2 rounded-lg" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("footer.desc")}
          </p>
        </div>
        
        <div>
          <h4 className="font-heading text-lg mb-6 text-white">{t("footer.products")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-primary">{t("products.filter.extinguisher")}</Link></li>
            <li><Link href="/products" className="hover:text-primary">{t("products.filter.cabinet")}</Link></li>
            <li><Link href="/products" className="hover:text-primary">{t("products.filter.system")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-6 text-white">{t("footer.company")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link href="/services" className="hover:text-primary">{t("nav.services")}</Link></li>
            <li><Link href="/resources" className="hover:text-primary">{t("nav.resources")}</Link></li>
            <li><Link href="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
            <li className="pt-2 border-t border-white/10 mt-2"><Link href="/admin" className="text-primary hover:text-white font-bold transition-colors">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg mb-6 text-white">{t("footer.contact")}</h4>
          <address className="not-italic text-sm text-muted-foreground space-y-3">
            <p>{language === "ar" ? COMPANY_INFO.addressAr : COMPANY_INFO.address}</p>
            <p dir="ltr">{t("footer.phone")} {COMPANY_INFO.phones.mobile}</p>
            <p dir="ltr">{t("footer.fax")} {COMPANY_INFO.phones.fax}</p>
            <p dir="ltr">{t("footer.email")} {COMPANY_INFO.email}</p>
          </address>
          <div className="flex gap-4 mt-6">
            <a href={COMPANY_INFO.socials.facebook} target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={COMPANY_INFO.socials.linkedin} target="_blank" rel="noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="container px-4 mt-16 pt-8 border-t border-white/10 text-center text-xs text-muted-foreground font-mono">
        © {new Date().getFullYear()} Meteory. {t("footer.rights")} ISO 9001:2015 • UL/FM (pumps & accessories).
      </div>
    </footer>
  );
}
