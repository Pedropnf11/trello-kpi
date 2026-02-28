import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";

const profiles = [
  {
    role: "Gestor",
    tag: "Manager",
    icon: Shield,
    color: "border-primary/50",
    tagColor: "bg-primary/20 text-primary",
    features: [
      "Visão completa de toda a equipa",
      "Filtragem por consultor",
      "Analytics avançado com gráficos",
      "Exportação PDF, CSV e Email",
      "Tabelas de performance semanais",
      "Gestão de pipeline agregada",
    ],
  },
  {
    role: "Vendedor",
    tag: "Sales",
    icon: Users,
    color: "border-success/50",
    tagColor: "bg-success/20 text-success",
    features: [
      "Pipeline pessoal e follow-ups",
      "Métricas individuais",
      "Focus Zone com alertas",
      "Visão dos seus próprios números",
      "Time tracking personalizado",
      "Interface simplificada",
    ],
  },
];

const ProfilesSection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dois perfis, uma plataforma
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada utilizador vê exactamente o que precisa.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((p, i) => (
            <motion.div
              key={p.role}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`glass-card p-8 border ${p.color}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <p.icon className="w-6 h-6" />
                <h3 className="text-2xl font-bold">{p.role}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.tagColor}`}>
                  {p.tag}
                </span>
              </div>
              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-secondary-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfilesSection;
