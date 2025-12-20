// Business Logic for KPIs
const KPILogic = {
    processarKPIs(cards, listas) {
        // Ordenar listas pela posição no Trello
        const listasOrdenadas = listas.sort((a, b) => a.pos - b.pos);

        // Estrutura de referência das listas
        const listsDef = listasOrdenadas.map(l => ({
            id: l.id,
            name: l.name
        }));

        const inicioSemana = Utils.getStartOfWeek();

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

        const processarCard = (card, dados, filterDate = null) => {
            const listId = card.idList;
            // Ignorar cards em listas arquivadas ou não mapeadas
            if (dados.listCounts[listId] === undefined) return;

            // Processar Comentários - buscar quem fez cada comentário
            if (card.actions && Array.isArray(card.actions)) {
                card.actions.forEach(action => {
                    // Verificar se é um comentário e se está no período filtrado (se aplicável)
                    if (action.type === 'commentCard') {
                        if (!filterDate || new Date(action.date) >= filterDate) {
                            const autor = action.memberCreator;
                            if (autor) {
                                // Inicializar consultor se não existir
                                if (!dados.consultores[autor.id]) {
                                    dados.consultores[autor.id] = {
                                        id: autor.id,
                                        nome: autor.fullName,
                                        comentarios: 0,
                                        leads: 0,
                                        listCounts: initListCounts()
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
            if (!filterDate || dataCriacao >= filterDate) {
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
                if (!filterDate || dataCriacao >= filterDate) {
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
                            if (!filterDate || dataComplete >= filterDate) {
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
            processarCard(card, dadosGeral, null);

            // Usar Data da Última Atividade para filtrar se o card APARECE na tabela semanal
            const dataAtividade = new Date(card.dateLastActivity);
            if (dataAtividade >= inicioSemana) {
                processarCard(card, dadosSemanal, inicioSemana);
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
    },

    filtrarDados(dadosOriginais, filterId) {
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
    },

    calcularAtividade(cards, membros) {
        const inicioSemana = Utils.getStartOfWeek();
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
                if (dataCriacao >= inicioSemana) {
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
                            if (dataComplete >= inicioSemana && atividadePorUsuario[membroId]) {
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
                if (dataAction >= inicioSemana && action.memberCreator) {
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
    },

    calcularTemposListas(cards, listas) {
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
        const inicioSemana = Utils.getStartOfWeek();

        if (!Array.isArray(cards)) {
            console.error('Dados de cards inválidos em calcularTemposListas');
            return tempos;
        }

        cards.forEach(card => {
            if (!card.actions || !Array.isArray(card.actions)) return;

            // Verificar se o card teve atividade na última semana
            const dataAtividade = new Date(card.dateLastActivity);
            if (dataAtividade < inicioSemana) return; // Ignorar cards sem atividade esta semana

            // Ordenar ações por data (mais antiga primeiro)
            const actions = card.actions.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Processar tempo na lista LEADS
            if (listaLeads) {
                const resultado = this._calcularTempoPermanenciaComCard(card, actions, listaLeads.id, agora, inicioSemana);
                if (resultado.tempo > 0) {
                    tempos.leads.tempos.push(resultado);
                }
            }

            // Processar tempo na lista Não atendeu
            if (listaNaoAtendeu) {
                const resultado = this._calcularTempoPermanenciaComCard(card, actions, listaNaoAtendeu.id, agora, inicioSemana);
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
    },

    _calcularTempoPermanenciaComCard(card, actions, listaId, agora, inicioSemana) {
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
                if (entradaNaLista < inicioSemana) {
                    entradaNaLista = inicioSemana;
                }
                tempoTotal = (agora - entradaNaLista) / (1000 * 60 * 60); // em horas
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
                    if (saidaDaLista >= inicioSemana || entradaNaLista >= inicioSemana) {
                        // Ajustar entrada se foi antes da semana
                        const entradaAjustada = entradaNaLista < inicioSemana ? inicioSemana : entradaNaLista;
                        tempoTotal += (saidaDaLista - entradaAjustada) / (1000 * 60 * 60); // em horas
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
    },

    _calcularTempoPermanencia(card, actions, listaId, agora) {
        // Manter função antiga para compatibilidade, mas não é mais usada
        const resultado = this._calcularTempoPermanenciaComCard(card, actions, listaId, agora, new Date(0));
        return resultado.tempo;
    }
};
