"use client";

import { useMemo } from 'react';
import { Activity, PipedriveUser } from '@/types/pipedrive';
import { Phone, Mail, Users, CheckSquare, Clock, Calendar, CircleDot } from 'lucide-react';

interface TeamActivityFeedProps {
    activities: Activity[];
    viewUsers: PipedriveUser[];
    limit?: number;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
    call:     { icon: Phone,       label: 'Chamada'  },
    email:    { icon: Mail,        label: 'Email'    },
    meeting:  { icon: Users,       label: 'Reunião'  },
    task:     { icon: CheckSquare, label: 'Tarefa'   },
    deadline: { icon: Clock,       label: 'Prazo'    },
};
const DEFAULT_CFG = { icon: CircleDot, label: 'Atividade' };

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (mins < 1)   return 'agora';
    if (mins < 60)  return `${mins}min`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'ontem';
    return `${days}d`;
}

function absoluteDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function TeamActivityFeed({ activities, viewUsers, limit = 15 }: TeamActivityFeedProps) {
    const userMap = useMemo(() => {
        const m = new Map<number, string>();
        viewUsers.forEach(u => m.set(u.id, u.name));
        return m;
    }, [viewUsers]);

    const feed = useMemo(() =>
        [...activities]
            .filter(a => a.done)
            .sort((a, b) => new Date(b.marked_as_done_time || b.add_time).getTime() - new Date(a.marked_as_done_time || a.add_time).getTime())
            .slice(0, limit)
            .map(a => ({
                ...a,
                ownerName:     userMap.get(a.user_id) ?? 'Desconhecido',
                ownerInitials: (userMap.get(a.user_id) ?? '?').substring(0, 2).toUpperCase(),
            })),
    [activities, limit, userMap]);

    const typeStats = useMemo(() => {
        const map = new Map<string, number>();
        activities.filter(a => a.done).forEach(a => {
            const type = a.type?.toLowerCase() || 'other';
            map.set(type, (map.get(type) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([type, count]) => ({ type, count, cfg: ACTIVITY_CONFIG[type] || DEFAULT_CFG }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);
    }, [activities]);

    const totalDone = activities.filter(a => a.done).length;

    return (
        <div className="card p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-4 rounded-full" style={{ background: 'var(--blue)' }}></span>
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                            Feed da Equipa
                        </h3>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Atividades concluídas · todos os vendedores
                        </p>
                    </div>
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    {totalDone} feitas
                </span>
            </div>

            {/* Resumo por tipo */}
            {typeStats.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
                    {typeStats.map(({ type, count, cfg }) => {
                        const Icon = cfg.icon;
                        return (
                            <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                <Icon className="w-3 h-3" style={{ color: 'var(--text-muted)' } as any} />
                                {count}× {cfg.label}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Feed */}
            {feed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                    <Calendar className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>Sem atividades concluídas</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {feed.map(activity => {
                        const cfg  = ACTIVITY_CONFIG[activity.type?.toLowerCase()] || DEFAULT_CFG;
                        const Icon = cfg.icon;
                        const dateStr = activity.marked_as_done_time || activity.add_time;

                        return (
                            <div key={activity.id}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-colors"
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Ícone tipo */}
                                <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                    <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' } as any} />
                                </div>

                                {/* Avatar dono */}
                                <div className="w-6 h-6 shrink-0 rounded-md flex items-center justify-center text-[8px] font-black"
                                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                    {activity.ownerInitials}
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                        {activity.subject || cfg.label}
                                    </p>
                                    <p className="text-[9px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>
                                            {activity.ownerName.split(' ')[0]}
                                        </span>
                                        <span className="mx-1">·</span>
                                        {cfg.label}
                                        {activity.deal_title && <span> · {activity.deal_title}</span>}
                                    </p>
                                </div>

                                {/* Data */}
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                    <span className="text-[10px] font-bold tabular-nums capitalize" style={{ color: 'var(--text-secondary)' }}>
                                        {absoluteDate(dateStr)}
                                    </span>
                                    <span className="text-[9px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{timeAgo(dateStr)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalDone > limit && (
                <p className="text-[10px] text-center mt-4 pt-3" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    +{totalDone - limit} anteriores
                </p>
            )}
        </div>
    );
}
