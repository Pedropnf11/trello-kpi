KPILogic.calcularTemposListas = function (cards, listas, customStartDate = null, customEndDate = null) {
    // Encontrar as listas "LEADS" ou "Leads" e "Não atendeu"
    const listaLeads = listas.find(l => l.name.toLowerCase() === 'leads');
    const listaNaoAtendeu = listas.find(l => l.name.toLowerCase().includes('não atendeu') || l.name.toLowerCase().includes('nao atendeu'));

    const tempos = {
        leads: {
            tempos: [],
            media: 0,
            maisRapido: null,
            maisLento: null,
            nomeList: listaLeads?.name || 'LEADS'
        },
        naoAtendeu: {
            tempos: [],
            media: 0,
            maisRapido: null,
            maisLento: null,
            nomeList: listaNaoAtendeu?.name || 'Não atendeu'
        }
    };

    if (!listaLeads && !listaNaoAtendeu) {
        return tempos; // Retorna vazio se não encontrar as listas
    }

    const agora = new Date();
    let inicioPeriodo, fimPeriodo;
    if (customStartDate && customEndDate) {
        inicioPeriodo = new Date(customStartDate);
        fimPeriodo = new Date(customEndDate);
        fimPeriodo.setHours(23, 59, 59, 999);
    } else {
        inicioPeriodo = Utils.getStartOfWeek();
        fimPeriodo = new Date();
    }

    if (!Array.isArray(cards)) {
        console.error('Dados de cards inválidos em calcularTemposListas');
        return tempos;
    }

    cards.forEach(card => {
        if (!card.actions || !Array.isArray(card.actions)) return;

        // Verificar se o card teve atividade na última semana
        const dataAtividade = new Date(card.dateLastActivity);
        if (dataAtividade < inicioPeriodo) return; // Ignorar cards sem atividade esta semana

        // Ordenar ações por data (mais antiga primeiro)
        const actions = card.actions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Processar tempo na lista LEADS
        if (listaLeads) {
            const resultado = this._calcularTempoPermanenciaComCard(card, actions, listaLeads.id, agora, inicioPeriodo, fimPeriodo);
            if (resultado.tempo > 0) {
                tempos.leads.tempos.push(resultado);
            }
        }

        // Processar tempo na lista Não atendeu
        if (listaNaoAtendeu) {
            const resultado = this._calcularTempoPermanenciaComCard(card, actions, listaNaoAtendeu.id, agora, inicioPeriodo, fimPeriodo);
            if (resultado.tempo > 0) {
                tempos.naoAtendeu.tempos.push(resultado);
            }
        }
    });

    // Calcular médias, mais rápido e mais lento para LEADS
    if (tempos.leads.tempos.length > 0) {
        const somaTempos = tempos.leads.tempos.reduce((a, b) => a + b.tempo, 0);
        tempos.leads.media = somaTempos / tempos.leads.tempos.length;

        // Ordenar por tempo
        const ordenados = [...tempos.leads.tempos].sort((a, b) => a.tempo - b.tempo);
        tempos.leads.maisRapido = ordenados[0];
        tempos.leads.maisLento = ordenados[ordenados.length - 1];
    }

    // Calcular médias, mais rápido e mais lento para Não Atendeu
    if (tempos.naoAtendeu.tempos.length > 0) {
        const somaTempos = tempos.naoAtendeu.tempos.reduce((a, b) => a + b.tempo, 0);
        tempos.naoAtendeu.media = somaTempos / tempos.naoAtendeu.tempos.length;

        // Ordenar por tempo
        const ordenados = [...tempos.naoAtendeu.tempos].sort((a, b) => a.tempo - b.tempo);
        tempos.naoAtendeu.maisRapido = ordenados[0];
        tempos.naoAtendeu.maisLento = ordenados[ordenados.length - 1];
    }

    return tempos;
};

KPILogic._calcularTempoPermanenciaComCard = function (card, actions, listaId, agora, inicioPeriodo, fimPeriodo) {
    let tempoTotal = 0;
    let entradaNaLista = null;
    let saidaDaLista = null;

    // Se o card está atualmente na lista
    if (card.idList === listaId) {
        // Buscar quando entrou pela última vez
        for (let i = actions.length - 1; i >= 0; i--) {
            const action = actions[i];
            const dataAction = new Date(action.date);

            if (action.type === 'updateCard' && action.data?.listAfter?.id === listaId) {
                entradaNaLista = dataAction;
                break;
            } else if (action.type === 'createCard') {
                // Card foi criado nesta lista
                entradaNaLista = Utils.getCardDate(card.id);
                break;
            }
        }

        if (entradaNaLista) {
            // Se entrou antes da semana, considerar início da semana
            if (entradaNaLista < inicioPeriodo) {
                entradaNaLista = inicioPeriodo;
            }

            // Se ainda está lá, conta até agora ou até o fim do periodo?
            const fimContagem = (agora > fimPeriodo) ? fimPeriodo : agora;

            if (fimContagem > entradaNaLista) {
                tempoTotal = (fimContagem - entradaNaLista) / (1000 * 60 * 60); // em horas
            }
        }
    } else {
        // Card já saiu da lista, calcular tempo que ficou
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const dataAction = new Date(action.date);

            // Entrada na lista
            if (action.type === 'updateCard' && action.data?.listAfter?.id === listaId) {
                entradaNaLista = dataAction;
            }
            // Card foi criado nesta lista
            else if (action.type === 'createCard' && i === 0) {
                const dataCriacao = Utils.getCardDate(card.id);
                // Verificar se card ainda está na lista de criação
                const primeiraMov = actions.find(a => a.type === 'updateCard' && a.data?.listBefore);
                if (!primeiraMov || primeiraMov.data.listBefore.id === listaId) {
                    entradaNaLista = dataCriacao;
                }
            }
            // Saída da lista
            else if (action.type === 'updateCard' && action.data?.listBefore?.id === listaId && entradaNaLista) {
                saidaDaLista = dataAction;

                // Calcular tempo apenas se a atividade foi na última semana
                if (saidaDaLista >= inicioPeriodo || entradaNaLista >= inicioPeriodo) {
                    // Ajustar entrada se foi antes da semana
                    const entradaAjustada = entradaNaLista < inicioPeriodo ? inicioPeriodo : entradaNaLista;

                    // Ajustar saida se foi depois do periodo
                    const saidaAjustada = saidaDaLista > fimPeriodo ? fimPeriodo : saidaDaLista;

                    if (saidaAjustada > entradaAjustada) {
                        tempoTotal += (saidaAjustada - entradaAjustada) / (1000 * 60 * 60); // em horas
                    }
                }

                entradaNaLista = null;
            }
        }
    }

    return {
        tempo: tempoTotal,
        cardNome: card.name,
        cardId: card.id
    };
};
