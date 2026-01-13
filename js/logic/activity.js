KPILogic.calcularAtividade = function (cards, membros, customStartDate = null, customEndDate = null) {
    let inicioPeriodo, fimPeriodo;
    if (customStartDate && customEndDate) {
        inicioPeriodo = new Date(customStartDate);
        fimPeriodo = new Date(customEndDate);
        fimPeriodo.setHours(23, 59, 59, 999);
    } else {
        inicioPeriodo = Utils.getStartOfWeek();
        fimPeriodo = new Date();
    }

    const checkDate = (date) => date >= inicioPeriodo && date <= fimPeriodo;
    const atividadePorUsuario = {};

    if (!Array.isArray(cards)) {
        console.error('Dados de cards inválidos em calcularAtividade');
        return { maisAtivo: null, maisInativo: null };
    }

    // Inicializar todos os membros do board com 0 ações
    if (membros && Array.isArray(membros)) {
        membros.forEach(membro => {
            atividadePorUsuario[membro.id] = {
                id: membro.id,
                nome: membro.fullName,
                acoes: 0,
                duesCriadas: 0,
                duesATempo: 0,
                duesAtrasadas: 0
            };
        });
    }

    cards.forEach(card => {
        // Rastrear DUEs
        if (card.due) {
            const dueDate = new Date(card.due);
            const dataCriacao = Utils.getCardDate(card.id);

            // Se o card foi criado esta semana e tem due date
            if (checkDate(dataCriacao)) {
                // Buscar quem criou o card
                if (card.actions && Array.isArray(card.actions)) {
                    const createAction = card.actions.find(a => a.type === 'createCard');
                    if (createAction && createAction.memberCreator) {
                        const criadorId = createAction.memberCreator.id;
                        if (atividadePorUsuario[criadorId]) {
                            atividadePorUsuario[criadorId].duesCriadas++;
                        }
                    }
                }
            }

            // Se o due foi completado
            if (card.dueComplete) {
                // Buscar quando foi marcado como completo
                if (card.actions && Array.isArray(card.actions)) {
                    const completeAction = card.actions.find(a =>
                        a.type === 'updateCard' &&
                        a.data?.card?.dueComplete === true
                    );

                    if (completeAction && completeAction.memberCreator) {
                        const dataComplete = new Date(completeAction.date);
                        const membroId = completeAction.memberCreator.id;

                        // Verificar se foi completado esta semana
                        if (checkDate(dataComplete) && atividadePorUsuario[membroId]) {
                            // Verificar se foi a tempo ou atrasado
                            if (dataComplete <= dueDate) {
                                atividadePorUsuario[membroId].duesATempo++;
                            } else {
                                atividadePorUsuario[membroId].duesAtrasadas++;
                            }
                        }
                    }
                }
            }
        }

        // Contar ações gerais
        if (!card.actions || !Array.isArray(card.actions)) return;

        card.actions.forEach(action => {
            const dataAction = new Date(action.date);
            if (checkDate(dataAction) && action.memberCreator) {
                const userId = action.memberCreator.id;
                const userName = action.memberCreator.fullName;

                if (!atividadePorUsuario[userId]) {
                    atividadePorUsuario[userId] = {
                        id: userId,
                        nome: userName,
                        acoes: 0,
                        duesCriadas: 0,
                        duesATempo: 0,
                        duesAtrasadas: 0
                    };
                }
                atividadePorUsuario[userId].acoes++;
            }
        });
    });

    const usuarios = Object.values(atividadePorUsuario);

    if (usuarios.length === 0) {
        return {
            maisAtivo: null,
            maisInativo: null
        };
    }

    return {
        todos: usuarios, // Lista completa ordenada
        maisAtivo: usuarios[0],
        maisInativo: usuarios[usuarios.length - 1]
    };
};

KPILogic.gerarActionItems = function (cards, listas, membros, filterId = null) {
    if (!cards || !listas) return [];

    const actions = [];
    const now = new Date();

    // Helper para dias
    const getDaysStuck = (dateStr) => {
        if (!dateStr) return 0;
        const last = new Date(dateStr);
        return Math.floor((now - last) / (1000 * 60 * 60 * 24));
    };

    // Mapear nomes de listas para normalização
    const listMap = {};
    listas.forEach(l => listMap[l.id] = l.name);

    cards.forEach(card => {
        // Filtro de Membro
        if (filterId) {
            const memberIds = card.idMembers || [];
            if (!memberIds.includes(filterId)) return;
        }

        const daysStuck = getDaysStuck(card.dateLastActivity);
        const listName = listMap[card.idList] || '';
        const listNameLower = listName.toLowerCase();

        // Ignorar cards arquivados ou finalizados
        if (card.closed) return;
        if (listNameLower.includes('fechado') || listNameLower.includes('ganho') || listNameLower.includes('perdido')) return;

        // Obter nome dos membros
        const memberNames = (card.idMembers || []).map(id => {
            const m = membros.find(m => m.id === id);
            return m ? m.fullName : 'Sem membro';
        }).join(', ');

        const cardUrl = card.shortUrl || card.url;

        // Regras Solicitadas: > 90, > 30, > 7
        if (daysStuck > 90) {
            actions.push({
                type: "critical",
                card: card.name,
                member: memberNames,
                action: `CRÍTICO: Parado há ${daysStuck} dias`,
                priority: "critical",
                list: listName,
                days: daysStuck,
                url: cardUrl
            });
        }
        else if (daysStuck > 30) {
            actions.push({
                type: "stagnant",
                card: card.name,
                member: memberNames,
                action: `Muito antigo: ${daysStuck} dias parado`,
                priority: "high",
                list: listName,
                days: daysStuck,
                url: cardUrl
            });
        }
        else if (daysStuck > 7) {
            actions.push({
                type: "warning",
                card: card.name,
                member: memberNames,
                action: `Atenção: ${daysStuck} dias sem atividade`,
                priority: "medium",
                list: listName,
                days: daysStuck,
                url: cardUrl
            });
        }
    });

    // Ordenar: Critical > High > Medium
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return actions.sort((a, b) => {
        const pA = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 99;
        const pB = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 99;
        return pA - pB;
    });
};
