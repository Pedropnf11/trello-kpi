# Análise Técnica e Comercial: KPI Master (Real Estate Edition)

Este documento apresenta uma análise detalhada da aplicação **KPI Master Dashboard** e propõe um plano de comercialização e venda para o mercado.

---

## 1. Visão Geral da Plataforma

O **KPI Master** é um painel de controlo de performance (Dashboard) em tempo real, focado no setor imobiliário, que transforma o **Trello** num CRM de vendas inteligente e visual. 

A aplicação conecta-se de forma segura e direta via API do Trello (OAuth), analisa as atividades, cartões e listas da equipa e gera métricas instantâneas sobre leads quentes, tempos de paragem de propostas e a produtividade da equipa comercial.

### Ficha Técnica
*   **Tecnologias Core:** HTML5, CSS3/Tailwind CSS (design escuro premium com efeitos de glassmorphism), Vanilla JavaScript.
*   **Integrações:** Trello API (OAuth para Login e Leitura/Escrita de Dados), Webhooks (Make.com, Zapier).
*   **Motores de Exportação:** `html2canvas` & `jsPDF` (Exportação PDF visual direta do browser), motor de geração de ficheiros CSV.
*   **Segurança:** Client-side only (sem base de dados própria, garantindo privacidade absoluta dos dados dos clientes imobiliários).

---

## 2. O Problema vs. A Solução (Pain Points)

O plano de vendas baseia-se na resolução de quatro dores críticas que custam milhares de euros mensais às agências imobiliárias:

| O Problema (Dor do Cliente) | A Solução do KPI Master | Impacto Financeiro |
| :--- | :--- | :--- |
| **Leads "esquecidos":** Consultores deixam de contactar potenciais compradores por falta de alertas automáticos. | **Focus Zone:** Identifica automaticamente leads sem contacto há $X$ dias, listando-os por ordem de prioridade crítica. | Recuperação de vendas que iriam arrefecer. |
| **Reuniões de equipa longas:** Gestores perdem horas a pedir atualizações individuais do estado dos leads. | **Ranking de Equipa Automático:** Tabela dinâmica que mostra propostas, visitas e contratos de cada consultor em tempo real. | Economia de tempo útil de gestão e aumento do foco comercial. |
| **Burocracia nos relatórios:** Perda de tardes de domingo a compilar dados para reuniões ou relatórios semanais. | **Relatórios Num Clique:** Exportação de PDFs profissionais formatados para apresentação e CSVs estruturados. | Redução da carga administrativa. |
| **Gargalos invisíveis:** Negócios parados na fase de "Proposta Enviada" sem que a chefia perceba onde está a falha. | **Time Tracking por Fase:** Mede a média de dias que cada lead passa em cada etapa do pipeline imobiliário. | Otimização do processo de venda e aceleração do fecho. |

---

## 3. Funcionalidades Detalhadas (Diferenciadores do Produto)

### 3.1. Pipeline Imobiliário em Tempo Real
Acompanhamento visual da distribuição de leads pelas fases padrão de venda: **Novo Contacto**, **Visita Marcada**, **Proposta Enviada** e **Contrato Fechado**. O sistema analisa o estado do quadro e atualiza os gráficos a cada interação.

### 3.2. Focus Zone (Alertas de Leads a Arrefecer)
Filtro inteligente que categoriza a urgência dos leads com base no tempo desde a última atividade:
*   `Crítico` (Vermelho/Roxo) - Mais de 14 dias sem contacto.
*   `Alto` (Laranja) - Mais de 8 dias sem contacto.
*   `Médio` (Amarelo) - Mais de 5 dias sem contacto.

### 3.3. Time Tracking (Tempo Médio por Fase)
Permite selecionar listas de entrada e saída (ex: "Visita" até "Proposta") para calcular o tempo médio de maturação dos leads. Avisa graficamente quando a média de dias supera o ideal estipulado para a agência.

### 3.4. Interfaces Customizadas por Perfil de Acesso
*   **Diretor / Gestor (Manager):** Visão macro da agência, ranking dinâmico de consultores com comparação de metas, taxa de conversão geral e acesso a todos os quadros ativos da equipa.
*   **Consultor Imobiliário (Sales):** Interface focada apenas nos seus leads pessoais, permitindo ver a sua Focus Zone diária e obter acesso imediato a scripts de reativação de clientes.

### 3.5. Automação e Integrações Premium (Make/Zapier)
Configuração de Webhook dedicada. Ao clicar em "Enviar Relatório", o sistema gera o PDF estruturado e envia um payload JSON enriquecido para plataformas de automação (Make/Zapier), contendo:
1.  Os dados estruturados de conversão da agência (para alimentar Excel, base de dados ou enviar relatórios semanais por e-mail).
2.  O ficheiro PDF convertido em base64 para arquivo automático no Google Drive ou envio por WhatsApp/Slack.

### 3.6. Importador de Leads Inteligente (CSV)
Permite que a agência migre leads de outras plataformas imobiliárias carregando um CSV. O KPI Master cria automaticamente os cartões no Trello, associa o consultor responsável, adiciona descrições estruturadas e cria comentários com base no histórico do ficheiro.

---

## 4. Plano de Venda e Comercialização

Para monetizar e escalar o **KPI Master**, sugerem-se três estratégias principais de posicionamento comercial:

### Modelo A: SaaS Freemium (Assinatura Mensal)
Fidelizar o utilizador individual e cobrar pela escala da equipa.
*   **Plano Grátis (Individual):** Acesso a 1 quadro Trello, pipeline básico e Focus Zone de leads pessoais.
*   **Plano Premium Agent (9.99€/mês):** Acesso a relatórios PDF, scripts de reativação avançados e importação ilimitada de CSV.
*   **Plano Agency / Manager (29.99€ a 79.99€/mês):** Painel do Diretor, controle de equipas (até 20 consultores), ranking de performance automatizado e integração com Make/Zapier para relatórios automáticos de segunda-feira.

### Modelo B: White-Label para Grandes Agências (Venda B2B Direta)
Venda de licença corporativa ou setup inicial personalizado para redes imobiliárias (ex: ERA, Remax, Century 21) que já utilizam o Trello como base do seu fluxo de trabalho.
*   **Pacote Corporativo:** Customização do dashboard com a marca da agência (logo, cores corporativas, fontes específicas).
*   **Integração Dedicada:** Parametrizar automações de Make/Zapier para a infraestrutura de e-mail e CRM interna da rede.
*   **Suporte e Treino:** Formação inicial das equipas comerciais sobre como gerir o Trello para maximizar os gráficos de performance.

### Modelo C: "Lead Magnet" para Consultoria de Processos
Utilizar o KPI Master como uma ferramenta gratuita de diagnóstico rápido.
*   Ao oferecer auditorias de processos gratuitas para agências, o consultor conecta o KPI Master ao Trello da agência no momento.
*   O dashboard mostrará instantaneamente os leads parados e gargalos.
*   Isso serve como prova irrefutável de que a agência precisa de implementar melhores fluxos e contratar serviços de consultoria ou a versão avançada do software.

---

## 5. Proposta de Valor e Argumentação de Vendas (Copywriting)

Para campanhas de marketing ou reuniões comerciais, utilize as seguintes mensagens-chave:

1.  **"Não compre um CRM caro de 500€/mês. Use o Trello que a sua equipa já adora, com o poder de decisão de um CRM de topo."**
     *   *Porquê:* O Trello é simples e intuitivo. CRMs tradicionais são complexos e os consultores recusam-se a usar. O KPI Master une a simplicidade do Trello à inteligência de dados.
2.  **"O fim das tardes de domingo perdidas em Excel."**
    *   *Porquê:* Gestores gastam horas a compilar relatórios. Com um clique, o KPI Master gera um PDF de alta qualidade e envia-o para o e-mail ou WhatsApp da direção.
3.  **"Segurança absoluta: Os dados dos seus clientes não saem do Trello."**
    *   *Porquê:* Imobiliárias são muito céticas quanto a partilhar a sua base de dados de leads. Como a aplicação corre 100% no browser do utilizador e comunica diretamente com o Trello, a agência tem garantia total de conformidade com o RGPD.

---

## 6. Funcionalidades Complementares Identificadas no Código

Para além do núcleo de negócios imobiliários, a plataforma dispõe de uma robusta camada técnica e de usabilidade:

### 6.1. Gráficos Analíticos Dinâmicos (Chart.js)
No modo de visualização de gráficos (`viewMode: 'graphs'`), a aplicação desenha:
*   **Gráfico de Barras Horizontais (Performance):** Top 10 consultores ordenados por volume de leads e número de comentários inseridos nos cartões.
*   **Gráfico de Dispersão (Scatter Chart):** Cruzamento de leads vs. comentários por consultor, permitindo ao gestor avaliar visualmente a qualidade do acompanhamento comercial por lead.
*   **Gráfico de Distribuição Circular (Doughnut):** Mostra a distribuição percentual e absoluta de leads pelas listas ativas do Trello com base no volume atual.
*   **Gráfico de Tempo Médio (Barra Vertical):** Análise comparativa do tempo médio de permanência dos leads em cada fase (ex: tempo ativo vs. "Não Atendeu").

### 6.2. Filtros e Validações Avançadas de Dados
*   **Filtro Temporal Inteligente:** Seleção de datas (`startDate`/`endDate`) com validação que impede datas iniciais posteriores ao término ou períodos de análise superiores a 1 ano. Inclui feedback visual de *loading* e *debounce* de 500ms para evitar sobrecargas de chamadas de rede.
*   **Filtro por Membro:** Possibilidade de isolar as métricas de um consultor específico com um único clique.
*   **Controle de Funil Customizado:** Permite ocultar listas indesejadas (com botão `X` direto na UI) e redefinir o funil, bem como escolher dinamicamente as listas de fronteira esquerda e direita para o cálculo do *Time Tracking*.

### 6.3. Otimizações de Performance e Robustez
*   **Rate Limiter de API Integrado:** Proteção nativa no ficheiro de API que limita os pedidos ao Trello a um máximo de 100 pedidos por minuto, evitando bloqueios na plataforma original.
*   **Validação Rígida de IDs:** Sistema que valida a estrutura de IDs do Trello (Board, List, Card, Member) antes de enviar qualquer requisição à rede para evitar quebras silenciosas.
*   **Telemetria Vercel Analytics:** Código integrado para rastreio de audiência, taxas de conversão e carregamento de páginas em produção.
