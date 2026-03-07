import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto glass-card p-12 sm:p-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple/10" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para transformar o teu Trello?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Conecta o teu quadro e começa a ver métricas de performance em menos de 2 minutos.
          </p>
          <Button size="lg" className="text-base px-10 py-6 glow-blue font-semibold">
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
