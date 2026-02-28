import { motion } from "framer-motion";
import {
  Lock,
  Users,
  BarChart3,
  Target,
  Clock,
  LineChart,
  Table,
  CalendarDays,
  Download,
  RefreshCw,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Autenticação OAuth",
    description: "Login seguro e instantâneo com a conta Trello. Sem registos nem passwords adicionais.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Dois Perfis",
    description: "Gestor com visão completa da equipa. Vendedor com pipeline e métricas pessoais.",
    color: "text-success",
  },
  {
    icon: BarChart3,
    title: "Pipeline em Funil",
    description: "Funil interativo com stock real de cada etapa, percentagens e barras animadas clicáveis.",
    color: "text-purple",
  },
  {
    icon: Target,
    title: "Focus Zone",
    description: "Alertas automáticos para prazos em atraso. Priorização por criticidade com link direto ao Trello.",
    color: "text-destructive",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Tempo médio dos cards em cada lista. Identifica gargalos no processo comercial.",
    color: "text-warning",
  },
  {
    icon: LineChart,
    title: "Analytics Avançado",
    description: "Gráficos de performance, distribuição, dispersão e evolução temporal por consultor.",
    color: "text-indigo",
  },
  {
    icon: Table,
    title: "Tabelas de Performance",
    description: "Métricas semanais e acumuladas: leads, comentários, follow-ups e prazos por consultor.",
    color: "text-primary",
  },
  {
    icon: CalendarDays,
    title: "Actividade da Equipa",
    description: "Acompanhamento em tempo real da actividade recente de cada membro do quadro.",
    color: "text-success",
  },
  {
    icon: Download,
    title: "Exportação Múltipla",
    description: "Exporta em PDF, CSV ou envia por email via webhook. Relatórios completos num clique.",
    color: "text-purple",
  },
  {
    icon: RefreshCw,
    title: "Tempo Real",
    description: "Refresh instantâneo dos dados sem recarregar a página. Sessão e estado preservados.",
    color: "text-indigo",
  },
  {
    icon: Smartphone,
    title: "100% Responsivo",
    description: "Interface adaptada para mobile com sidebar deslizante e layout em grid adaptativo.",
    color: "text-warning",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo o que precisas para gerir a tua equipa
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Funcionalidades pensadas para equipas comerciais que usam Trello como CRM.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className="glass-card p-6 hover:border-primary/30 transition-colors group"
            >
              <f.icon className={`w-6 h-6 ${f.color} mb-4 group-hover:scale-110 transition-transform`} />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
