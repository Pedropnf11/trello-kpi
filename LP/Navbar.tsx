import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#", label: "Demo" },
  { href: "#", label: "Preços" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Trello KPI</span>
          </div>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden sm:inline text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Entrar →
            </a>
            <button
              className="sm:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              onClick={() => setOpen((prev: boolean) => !prev)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 sm:hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#"
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors pt-2 border-t border-border/40"
                onClick={() => setOpen(false)}
              >
                Entrar →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
