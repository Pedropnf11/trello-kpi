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
