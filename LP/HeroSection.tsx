import { motion } from "framer-motion";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4 text-primary" />
            Dashboard de Performance para Equipas Comerciais
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Transforma o teu Trello num{" "}
            <span className="text-gradient">Dashboard de KPIs</span>
          </h1>

          <p className="text-lg sm:text-xl text-secondary-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Métricas em tempo real, pipeline visual, alertas automáticos e relatórios de equipa — tudo gerado a partir dos teus quadros Trello, sem configuração manual.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 py-6 glow-blue font-semibold">
              Começar Grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6 border-muted-foreground/30 font-medium">
              Ver Demo
            </Button>
          </div>
        </motion.div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 glass-card p-2 glow-blue"
        >
          <div className="bg-background rounded-lg p-4 sm:p-6">
            <DashboardMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const DashboardMockup = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
    {[
      { label: "Leads Activos", value: "247", change: "+12%", color: "text-primary" },
      { label: "Taxa Conversão", value: "34%", change: "+5%", color: "text-success" },
      { label: "Follow-ups Pendentes", value: "18", change: "-3", color: "text-warning" },
      { label: "Receita Estimada", value: "€142K", change: "+22%", color: "text-success" },
    ].map((stat) => (
      <div key={stat.label} className="glass-card p-3 sm:p-4 text-left">
        <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
        <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        <p className="text-xs text-success mt-1">{stat.change}</p>
      </div>
    ))}

    {/* Mini funnel */}
    <div className="col-span-2 glass-card p-4">
      <p className="text-xs text-muted-foreground mb-3">Pipeline</p>
      <div className="space-y-2">
        {[
          { stage: "Novo Lead", pct: 100, color: "bg-primary" },
          { stage: "Contactado", pct: 72, color: "bg-indigo" },
          { stage: "Proposta", pct: 45, color: "bg-purple" },
          { stage: "Negociação", pct: 28, color: "bg-warning" },
          { stage: "Fechado", pct: 18, color: "bg-success" },
        ].map((s) => (
          <div key={s.stage} className="flex items-center gap-2 text-xs">
            <span className="w-20 text-muted-foreground truncate">{s.stage}</span>
            <div className="flex-1 h-2 rounded-full bg-muted">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
            </div>
            <span className="text-foreground w-8 text-right">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Mini chart bars */}
    <div className="col-span-2 glass-card p-4">
      <p className="text-xs text-muted-foreground mb-3">Performance Semanal</p>
      <div className="flex items-end gap-1.5 h-20">
        {[40, 65, 50, 80, 72, 90, 60].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-primary/70 hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
        <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
      </div>
    </div>
  </div>
);

export default HeroSection;
