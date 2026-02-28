import { BarChart3 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>Trello KPI Dashboard</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Trello KPI. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
