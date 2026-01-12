Charts.renderAll = function (kpis, filterId) {
    const dadosGeral = KPILogic.filtrarDados(kpis.geral, filterId);
    const dadosSemanal = KPILogic.filtrarDados(kpis.semanal, filterId);

    // Aguardar o DOM estar pronto
    setTimeout(() => {
        this.renderConsultorPerformance('chartSemanalPerformance', dadosSemanal);
        this.renderConsultorPerformance('chartGeralPerformance', dadosGeral);
        this.renderListaDistribuicao('chartDistribuicao', kpis.geral, kpis.listsDef);
        this.renderComentariosVsLeads('chartComentariosLeads', dadosSemanal);
        this.renderTempoMedio('chartTempoMedio', kpis.temposListas);
    }, 100);
};
