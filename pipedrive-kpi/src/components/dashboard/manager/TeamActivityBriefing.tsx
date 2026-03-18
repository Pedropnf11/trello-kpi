"use client";

import { useMemo } from 'react';
import { Activity, PipedriveUser } from '@/types/pipedrive';
import { AlertTriangle, Calendar, CheckCircle2, CheckSquare, Clock } from 'lucide-react';

interface TeamActivityBriefingProps {
    activities: Activity[];
    viewUsers: PipedriveUser[];
}

export default function TeamActivityBriefing({ activities, viewUsers }: TeamActivityBriefingProps) {
    const todayStr = new Date().toISOString().split('T')[0];

    const rows = useMemo(() => {
        return viewUsers.map(user => {
            const ua = activities.filter(a => a.user_id === user.id);
            return {
                id:         user.id,
                name:       user.name,
                initials:   user.name.substring(0, 2).toUpperCase(),
                overdue:    ua.filter(a => !a.done && a.due_date && a.due_date < todayStr).length,
                dueToday:   ua.filter(a => !a.done && a.due_date === todayStr).length,
                doneToday:  ua.filter(a => a.done && (a.marked_as_done_time || '').startsWith(todayStr)).length,
            };
        });
    }, [activities, viewUsers, todayStr]);

    const totalPending = rows.reduce((s, r) => s + r.dueToday + r.overdue, 0);
    const totalDone    = rows.reduce((s, r) => s + r.doneToday, 0);
    const totalAll     = totalPending + totalDone;
    const progressPct  = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;
    const hasUrgent    = rows.some(r => r.overdue > 0);

    const progressColor = progressPct === 100 ? 'var(--green)' : hasUrgent ? 'var(--rose)' : 'var(--blue)';

    return (
        <div className="card overflow-hidden">

            {/* Header */}
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-4 rounded-full shrink-0"
                            style={{ background: hasUrgent ? 'var(--rose)' : 'var(--border-mid)' }}></span>
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.12em]"
                                style={{ color: 'var(--text-secondary)' }}>
                                Atividades da Equipa Hoje
                            </h3>
                            <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                Cobertura do dia · atrasados · tarefas concluídas
                            </p>
                        </div>
                    </div>
                    {totalAll > 0 && (
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                            style={{
                                background: hasUrgent ? 'rgba(244,63,94,0.08)' : progressPct === 100 ? 'rgba(16,185,129,0.08)' : 'var(--bg-surface)',
                                color:      hasUrgent ? 'var(--rose)' : progressPct === 100 ? 'var(--green)' : 'var(--text-secondary)',
                                border:     `1px solid ${hasUrgent ? 'rgba(244,63,94,0.2)' : progressPct === 100 ? 'rgba(16,185,129,0.2)' : 'var(--border)'}`,
                            }}>
                            {progressPct}% concluído
                        </span>
                    )}
                </div>

                {/* Barra de progresso do dia */}
                {totalAll > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider"
                            style={{ color: 'var(--text-muted)' }}>
                            <span>{totalDone} de {totalAll} feitas hoje</span>
                            <span>{totalPending} pendentes</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progressPct}%`, background: progressColor }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Linhas por vendedor */}
            <div>
                {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                        <Calendar className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Sem dados de atividade</p>
                    </div>
                ) : (
                    rows.map(row => {
                        const allDone = row.dueToday === 0 && row.overdue === 0;
                        return (
                            <div key={row.id}
                                className="flex items-center gap-3 px-5 py-3 transition-colors"
                                style={{ borderBottom: '1px solid var(--border)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Avatar */}
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                    {row.initials}
                                </div>

                                {/* Nome */}
                                <span className="text-[12px] font-bold w-24 truncate shrink-0" style={{ color: 'var(--text-primary)' }}>
                                    {row.name.split(' ')[0]}
                                </span>

                                {/* Badges de estado */}
                                <div className="flex-1 flex items-center gap-2 flex-wrap">
                                    {row.overdue > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--rose)' }}>
                                            <AlertTriangle className="w-2.5 h-2.5" />
                                            {row.overdue} atrasada{row.overdue !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {row.dueToday > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--orange)' }}>
                                            <Clock className="w-2.5 h-2.5" />
                                            {row.dueToday} para hoje
                                        </span>
                                    )}
                                    {row.doneToday > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'var(--green)' }}>
                                            <CheckSquare className="w-2.5 h-2.5" />
                                            {row.doneToday} feita{row.doneToday !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {allDone && row.doneToday === 0 && (
                                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                                            Sem atividades hoje
                                        </span>
                                    )}
                                    {allDone && row.doneToday > 0 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'var(--green)' }}>
                                            <CheckCircle2 className="w-2.5 h-2.5" /> Em dia
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
