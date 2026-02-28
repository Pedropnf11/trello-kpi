import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2 font-bold text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          <span>Trello KPI</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a>
          <a href="#" className="hover:text-foreground transition-colors">Demo</a>
          <a href="#" className="hover:text-foreground transition-colors">Preços</a>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Entrar →
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
