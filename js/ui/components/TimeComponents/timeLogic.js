KPILogic.calcularTemposListas = function (cards, listas, customStartDate = null, customEndDate = null) {
    const tempos = {};

    if (!listas || listas.length === 0) {
        return tempos;
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

    // Inicializar estrutura para TODAS as listas
    listas.forEach(lista => {
        tempos[lista.id] = {
            id: lista.id,
            nome: lista.name,
            tempos: [],
            media: 0,
            maisRapido: null,
            maisLento: null
        };
    });

    // Processar cada card
    cards.forEach(card => {
        if (!card.actions || !Array.isArray(card.actions)) return;

        // Verificar se o card teve atividade no período
        const dataAtividade = new Date(card.dateLastActivity);
        if (dataAtividade < inicioPeriodo) return;

        // Ordenar ações por data (mais antiga primeiro)
        const actions = card.actions.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Processar tempo em CADA lista
        listas.forEach(lista => {
            const resultado = this._calcularTempoPermanenciaComCard(card, actions, lista.id, agora, inicioPeriodo, fimPeriodo);
            if (resultado.tempo > 0) {
                tempos[lista.id].tempos.push(resultado);
            }
        });
    });

    // Calcular médias, mais rápido e mais lento para CADA lista
    Object.keys(tempos).forEach(listaId => {
        const lista = tempos[listaId];

        if (lista.tempos.length > 0) {
            const somaTempos = lista.tempos.reduce((a, b) => a + b.tempo, 0);
            lista.media = somaTempos / lista.tempos.length;

            // Ordenar por tempo
            const ordenados = [...lista.tempos].sort((a, b) => a.tempo - b.tempo);
            lista.maisRapido = ordenados[0];
            lista.maisLento = ordenados[ordenados.length - 1];
        }
    });

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
