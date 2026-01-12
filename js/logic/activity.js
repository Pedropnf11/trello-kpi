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

    // Ordenar por número de ações
    usuarios.sort((a, b) => b.acoes - a.acoes);

    return {
        maisAtivo: usuarios[0],
        maisInativo: usuarios[usuarios.length - 1]
    };
};
