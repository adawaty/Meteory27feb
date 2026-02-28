import { Navbar, Footer } from "@/components/Layout";
import TrustBadges from "@/components/TrustBadges";
import WhatsAppFab from "@/components/WhatsAppFab";
import { Route, Switch, Router, useLocation, type BaseLocationHook } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Projects from "@/pages/Projects";
import Industries from "@/pages/Industries";
import Resources from "@/pages/Resources";
import Certificates from "@/pages/Certificates";
import BuildQuote from "@/pages/BuildQuote";
import Codes from "@/pages/Codes";
import SystemsLab from "@/pages/SystemsLab";
import BimLibrary from "@/pages/BimLibrary";
import Game from "@/pages/Game";
import CodeArticleTextileFactoryEgypt from "@/pages/codes/EgyptTextileFactory";
import CodeArticleWarehouseTenthRamadan from "@/pages/codes/Warehouse10thRamadan";
import CodeArticleCommercialKitchenNewCairo from "@/pages/codes/CommercialKitchenNewCairo";
import CodeArticleLogisticsWarehouseAlexandria from "@/pages/codes/LogisticsWarehouseAlexandria";
import LeadCalculator from "@/pages/LeadCalculator";
import Quote from "@/pages/Quote";
import Datasheet from "@/pages/Datasheet";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Normalize static preview paths (e.g. /dist/index.html) to /
const useNormalizedLocation: BaseLocationHook = (opts) => {
  const [location, navigate] = useBrowserLocation(opts as any);
  const normalized = location.replace(/\/(dist\/)?index\.html$/, "/");
  return [normalized, navigate];
};

// Component to handle scroll on route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function AppRoutes() {
  const [location] = useLocation();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:border focus:border-border"
      >
        Skip to main content
      </a>
      <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-grow">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/products" component={Products} />
              <Route path="/about" component={About} />
              <Route path="/services" component={Services} />
              <Route path="/contact" component={Contact} />
              <Route path="/projects" component={Projects} />
              <Route path="/industries" component={Industries} />
              <Route path="/resources" component={Resources} />
              <Route path="/bim-library" component={BimLibrary} />
              <Route path="/systems-lab" component={SystemsLab} />
              <Route path="/game" component={Game} />
              <Route path="/certificates" component={Certificates} />
              <Route path="/build-quote" component={BuildQuote} />
              <Route path="/codes" component={Codes} />
              <Route path="/codes/egypt-fire-code-textile-factory" component={CodeArticleTextileFactoryEgypt} />
              <Route path="/codes/warehouse-10th-of-ramadan" component={CodeArticleWarehouseTenthRamadan} />
              <Route path="/codes/commercial-kitchen-new-cairo" component={CodeArticleCommercialKitchenNewCairo} />
              <Route path="/codes/logistics-warehouse-alexandria" component={CodeArticleLogisticsWarehouseAlexandria} />
              <Route path="/calculator" component={LeadCalculator} />
              <Route path="/quote" component={Quote} />
              <Route path="/products/:id/datasheet" component={Datasheet} />
              <Route path="/admin" component={Admin} />
              <Route path="/login" component={Login} />
              <Route component={NotFound} />
            </Switch>
          </motion.div>
        </AnimatePresence>
      </main>
      <TrustBadges />
      <WhatsAppFab />
      <Footer />
      <Toaster />
      </div>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Router hook={useNormalizedLocation}>
              <AppRoutes />
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
