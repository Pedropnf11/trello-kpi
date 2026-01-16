// Initialize KPILogic namespace
window.KPILogic = window.KPILogic || {};

KPILogic.processarKPIs = function (cards, listas, customStartDate = null, customEndDate = null) {
    // Ordenar listas pela posição no Trello
    const listasOrdenadas = listas.sort((a, b) => a.pos - b.pos);

    // Estrutura de referência das listas
    const listsDef = listasOrdenadas.map(l => ({
        id: l.id,
        name: l.name
    }));

    let inicioPeriodo, fimPeriodo;

    if (customStartDate && customEndDate) {
        inicioPeriodo = new Date(customStartDate);
        // Ajustar fim do periodo para o final do dia (23:59:59)
        fimPeriodo = new Date(customEndDate);
        fimPeriodo.setHours(23, 59, 59, 999);
    } else {
        inicioPeriodo = Utils.getStartOfWeek();
        fimPeriodo = new Date(); // Agora
    }

    // Verificação de segurança
    if (!Array.isArray(cards)) {
        console.error('Dados de cards inválidos em processarKPIs:', cards);
        return {
            listsDef,
            geral: { consultores: [], listCounts: {}, totais: { leads: 0, consultores: 0, comentarios: 0 } },
            semanal: { consultores: [], listCounts: {}, totais: { leads: 0, consultores: 0, comentarios: 0 } }
        };
    }

    // Inicializa contadores zerados para todas as listas
    const initListCounts = () => {
        const counts = {};
        listsDef.forEach(l => counts[l.id] = 0);
        return counts;
    };

    const criarEstruturaDados = () => ({
        consultores: {},
        listCounts: initListCounts(), // Contagem global por lista
        totais: { leads: 0, consultores: 0, comentarios: 0 }
    });

    const dadosGeral = criarEstruturaDados();
    const dadosSemanal = criarEstruturaDados();

    const processarCard = (card, dados, filterStart = null, filterEnd = null) => {
        const listId = card.idList;
        // Ignorar cards em listas arquivadas ou não mapeadas
        if (dados.listCounts[listId] === undefined) return;

        // Função auxiliar filtro de data
        const checkDate = (dateStr) => {
            if (!filterStart || !filterEnd) return true; // Se não tem filtro, passa
            const d = new Date(dateStr);
            return d >= filterStart && d <= filterEnd;
        };

        // Processar Comentários - buscar quem fez cada comentário
        if (card.actions && Array.isArray(card.actions)) {
            card.actions.forEach(action => {
                // Verificar se é um comentário e se está no período filtrado (se aplicável)
                if (action.type === 'commentCard') {
                    if (checkDate(action.date)) {
                        const autor = action.memberCreator;
                        if (autor) {
                            // Inicializar consultor se não existir
                            if (!dados.consultores[autor.id]) {
                                dados.consultores[autor.id] = {
                                    id: autor.id,
                                    nome: autor.fullName,
                                    comentarios: 0,
                                    leads: 0,
                                    listCounts: initListCounts(),
                                    duesCriados: 0,
                                    duesATempo: 0,
                                    duesAtrasados: 0,
                                    duesPendentes: 0
                                };
                            }
                            // Incrementar comentários para o autor
                            dados.consultores[autor.id].comentarios++;
                        }
                    }
                }
            });
        }

        // Lógica de Novos Leads - buscar quem criou o card
        let isNovoLead = false;
        let criadorDoCard = null;
        const dataCriacao = Utils.getCardDate(card.id);

        // Verificar se o card foi criado no período (ou sem filtro para geral)
        if (checkDate(dataCriacao)) {
            isNovoLead = true;

            // Buscar quem criou o card nas actions
            if (card.actions && Array.isArray(card.actions)) {
                const createAction = card.actions.find(a => a.type === 'createCard');
                if (createAction && createAction.memberCreator) {
                    criadorDoCard = createAction.memberCreator;
                }
            }

            if (criadorDoCard) {
                // Inicializar consultor do criador se não existir
                if (!dados.consultores[criadorDoCard.id]) {
                    dados.consultores[criadorDoCard.id] = {
                        id: criadorDoCard.id,
                        nome: criadorDoCard.fullName,
                        comentarios: 0,
                        leads: 0,
                        listCounts: initListCounts(),
                        duesCriados: 0,
                        duesATempo: 0,
                        duesAtrasados: 0,
                        duesPendentes: 0
                    };
                }
                // Atribuir o lead ao criador
                dados.consultores[criadorDoCard.id].leads++;
                dados.totais.leads++;
            }
        }

        // Contagem de listas (status atual) - atribuir a quem está responsável pelo card agora
        dados.listCounts[listId]++;

        const membersList = (card.members && card.members.length > 0)
            ? card.members
            : [{ id: 'sem-membro', fullName: 'Leads sem Membro' }];

        membersList.forEach(member => {
            if (!dados.consultores[member.id]) {
                dados.consultores[member.id] = {
                    id: member.id,
                    nome: member.fullName,
                    comentarios: 0,
                    leads: 0,
                    listCounts: initListCounts(),
                    duesCriados: 0,
                    duesATempo: 0,
                    duesAtrasados: 0,
                    duesPendentes: 0
                };
            }

            // Contagem de listas atribuída aos membros responsáveis atuais
            dados.consultores[member.id].listCounts[listId]++;
        });

        // Processar DUEs
        if (card.due) {
            const dueDate = new Date(card.due);
            const dataCriacao = Utils.getCardDate(card.id);
            const agora = new Date();

            // Due foi criado neste período?
            if (checkDate(dataCriacao)) {
                if (criadorDoCard && dados.consultores[criadorDoCard.id]) {
                    dados.consultores[criadorDoCard.id].duesCriados++;
                }
            }

            // Due foi completado?
            if (card.dueComplete) {
                // Buscar quem completou e quando
                if (card.actions && Array.isArray(card.actions)) {
                    const completeAction = card.actions.find(a =>
                        a.type === 'updateCard' &&
                        a.data?.card?.dueComplete === true
                    );

                    if (completeAction && completeAction.memberCreator) {
                        const dataComplete = new Date(completeAction.date);
                        const membroId = completeAction.memberCreator.id;

                        // Foi completado neste período?
                        if (checkDate(dataComplete)) {
                            if (!dados.consultores[membroId]) {
                                dados.consultores[membroId] = {
                                    id: membroId,
                                    nome: completeAction.memberCreator.fullName,
                                    comentarios: 0,
                                    leads: 0,
                                    listCounts: initListCounts(),
                                    duesCriados: 0,
                                    duesATempo: 0,
                                    duesAtrasados: 0,
                                    duesPendentes: 0
                                };
                            }

                            // Completado a tempo ou atrasado?
                            if (dataComplete <= dueDate) {
                                dados.consultores[membroId].duesATempo++;
                            } else {
                                dados.consultores[membroId].duesAtrasados++;
                            }
                        }
                    }
                }
            } else {
                // Due não completado = Pendente
                // Atribuir due pendente aos membros atuais do card
                membersList.forEach(member => {
                    if (dados.consultores[member.id]) {
                        dados.consultores[member.id].duesPendentes++;
                    }
                });
            }
        }
    };

    cards.forEach(card => {
        processarCard(card, dadosGeral, null, null);

        // Usar Data da Última Atividade para filtrar se o card APARECE na tabela semanal
        const dataAtividade = new Date(card.dateLastActivity);
        if (dataAtividade >= inicioPeriodo && dataAtividade <= fimPeriodo) {
            processarCard(card, dadosSemanal, inicioPeriodo, fimPeriodo);
        }
    });

    const finalizarDados = (dados) => {
        dados.consultores = Object.values(dados.consultores);
        dados.totais.consultores = dados.consultores.length;
        dados.totais.comentarios = dados.consultores.reduce((sum, c) => sum + c.comentarios, 0);
        return dados;
    };

    return {
        listsDef,
        geral: finalizarDados(dadosGeral),
        semanal: finalizarDados(dadosSemanal)
    };
};

KPILogic.filtrarDados = function (dadosOriginais, filterId) {
    let consultores = dadosOriginais.consultores;
    if (filterId) {
        consultores = consultores.filter(c => c.id === filterId);
    }
    return {
        consultores,
        totais: {
            leads: consultores.reduce((sum, c) => sum + c.leads, 0),
            consultores: consultores.length,
            comentarios: consultores.reduce((sum, c) => sum + c.comentarios, 0)
        }
    };
};

KPILogic.calcularFunil = function (listas, listCounts) {
    if (!listCounts || !listas) return [];

    const definicaoEstagios = [
        { id: 'leads', nome: 'Leads', keywords: ['lead', 'entrada', 'novos', 'chegada'] },
        { id: 'contactado', nome: 'Contactado', keywords: ['contact', 'qualifica', 'agendamento', 'reunião', 'visita'] },
        { id: 'proposta', nome: 'Proposta', keywords: ['proposta', 'negocia', 'envia', 'follow'] },
        { id: 'fechado', nome: 'Fechado', keywords: ['fechado', 'vendido', 'ganho', 'contrato', 'pago', 'sucesso'] }
    ];

    let funilMap = { leads: 0, contactado: 0, proposta: 0, fechado: 0 };

    listas.forEach(lista => {
        const nomeNormalizado = lista.name.toLowerCase();
        const count = listCounts[lista.id] || 0;
        const estagio = definicaoEstagios.find(e => e.keywords.some(k => nomeNormalizado.includes(k)));

        if (estagio) {
            funilMap[estagio.id] += count;
        }
    });

    const dadosFinais = [
        { stage: 'Leads', count: funilMap.leads + funilMap.contactado + funilMap.proposta + funilMap.fechado, color: '#60A5FA' }, // Blue
        { stage: 'Contactado', count: funilMap.contactado + funilMap.proposta + funilMap.fechado, color: '#818CF8' }, // Indigo
        { stage: 'Proposta', count: funilMap.proposta + funilMap.fechado, color: '#A78BFA' }, // Purple
        { stage: 'Fechado', count: funilMap.fechado, color: '#34D399' } // Emerald
    ];

    for (let i = 0; i < dadosFinais.length; i++) {
        const atual = dadosFinais[i];
        const proximo = dadosFinais[i + 1];

        if (proximo) {
            const taxa = atual.count > 0 ? ((proximo.count / atual.count) * 100).toFixed(1) : 0;
            dadosFinais[i].conversionRate = taxa + '%';
            dadosFinais[i].dropOff = (100 - parseFloat(taxa)).toFixed(1) + '%';
        } else {
            dadosFinais[i].conversionRate = 'Final';
        }
    }

    return dadosFinais;
};

KPILogic.calcularFunilV2 = function (listas, listCounts, config = null) {
    if (!listCounts || !listas) return [];

    let funilMap = { leads: 0, contactado: 0, proposta: 0, fechado: 0 };

    if (config) {
        const etapas = ['leads', 'contactado', 'proposta', 'fechado'];
        etapas.forEach(etapa => {
            if (config[etapa] && Array.isArray(config[etapa])) {
                config[etapa].forEach(id => {
                    if (listCounts[id]) funilMap[etapa] += listCounts[id];
                });
            }
        });
    } else {
        const definicaoEstagios = [
            { id: 'leads', nome: 'Leads', keywords: ['lead', 'entrada', 'novos', 'chegada'] },
            { id: 'contactado', nome: 'Contactado', keywords: ['contact', 'qualifica', 'agendamento', 'reunião', 'visita'] },
            { id: 'proposta', nome: 'Proposta', keywords: ['proposta', 'negocia', 'envia', 'follow'] },
            { id: 'fechado', nome: 'Fechado', keywords: ['fechado', 'vendido', 'ganho', 'contrato', 'pago', 'sucesso'] }
        ];

        listas.forEach(lista => {
            const nomeNormalizado = lista.name.toLowerCase();
            const count = listCounts[lista.id] || 0;
            const estagio = definicaoEstagios.find(e => e.keywords.some(k => nomeNormalizado.includes(k)));

            if (estagio) {
                funilMap[estagio.id] += count;
            }
        });
    }

    const dadosFinais = [
        { stage: 'Leads', count: funilMap.leads + funilMap.contactado + funilMap.proposta + funilMap.fechado, color: '#60A5FA' }, // Blue
        { stage: 'Contactado', count: funilMap.contactado + funilMap.proposta + funilMap.fechado, color: '#818CF8' }, // Indigo
        { stage: 'Proposta', count: funilMap.proposta + funilMap.fechado, color: '#A78BFA' }, // Purple
        { stage: 'Fechado', count: funilMap.fechado, color: '#34D399' } // Emerald
    ];

    for (let i = 0; i < dadosFinais.length; i++) {
        const atual = dadosFinais[i];
        const proximo = dadosFinais[i + 1];

        if (proximo) {
            const taxa = atual.count > 0 ? ((proximo.count / atual.count) * 100).toFixed(1) : 0;
            dadosFinais[i].conversionRate = taxa + '%';
            dadosFinais[i].dropOff = (100 - parseFloat(taxa)).toFixed(1) + '%';
        } else {
            dadosFinais[i].conversionRate = 'Final';
        }
    }

    return dadosFinais;
};

KPILogic.calcularFunilTodasListas = function (listas, listCounts, hiddenLists = []) {
    if (!listCounts || !listas) return [];

    // 1. Filtrar listas ocultas e manter ORDEM (usando listas que já vêm ordenadas da API)
    const listasVisiveis = listas.filter(l => !hiddenLists.includes(l.id));

    // 2. Mapear para Formato do Funil (Usando Contagem REAL/STOCK)
    const colors = ['#60A5FA', '#818CF8', '#A78BFA', '#34D399', '#FBBF24', '#F472B6', '#6EE7B7'];

    const dados = listasVisiveis.map((lista, index) => {
        const cnt = listCounts[lista.id] || 0;
        return {
            id: lista.id,
            stage: lista.name,
            count: cnt, // Stock Real
            realCount: cnt,
            color: colors[index % colors.length]
        };
    });

    // 3. Métricas (% do total) em vez de conversão cumulativa
    const totalCount = dados.reduce((sum, d) => sum + d.count, 0);

    for (let i = 0; i < dados.length; i++) {
        const atual = dados[i];
        if (totalCount > 0) {
            // Mostra % do total do que está visível
            const share = ((atual.count / totalCount) * 100).toFixed(1);
            atual.conversionRate = `${share}%`;
            atual.dropOff = '';
        } else {
            atual.conversionRate = '0%';
            atual.dropOff = '';
        }
    }

    return dados;
};


KPILogic.calcularTemposListas = function (cards, listas, startDate, endDate) {
    const tempos = {};
    const now = new Date();

    listas.forEach(l => {
        tempos[l.id] = {
            id: l.id,
            nome: l.name,
            totalDias: 0,
            count: 0,
            tempoMedio: 0
        };
    });

    cards.forEach(card => {
        if (card.closed) return;

        // Calcular duração na lista (aprox by last activity)
        const lastActivity = new Date(card.dateLastActivity);
        const dias = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));

        if (tempos[card.idList]) {
            tempos[card.idList].totalDias += dias;
            tempos[card.idList].count++;
        }
    });

    Object.keys(tempos).forEach(id => {
        const t = tempos[id];
        if (t.count > 0) {
            t.tempoMedio = (t.totalDias / t.count).toFixed(1);
        }
    });

    return tempos;
};
