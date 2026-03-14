"use client";

import { useMemo } from 'react';
import { Activity } from '@/types/pipedrive';
import { Phone, Mail, Users, CheckSquare, Clock, Calendar, CheckCircle2, CircleDot } from 'lucide-react';

interface ActivityFeedProps {
    activities: Activity[];
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

// Tempo relativo curto para contexto rápido
function timeAgo(dateStr: string): string {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'ontem';
    return `${days}d`;
}

// Data absoluta — ex: "qui, 12 mar" ou "12 mar 2024" se ano diferente
function absoluteDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const isThisYear = d.getFullYear() === now.getFullYear();

    return d.toLocaleDateString('pt-PT', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        ...(isThisYear ? {} : { year: 'numeric' }),
    });
}

export default function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
    const feed = useMemo(() => {
        return [...activities]
            .filter(a => a.done)
            .sort((a, b) => {
                const da = new Date(a.marked_as_done_time || a.add_time).getTime();
                const db = new Date(b.marked_as_done_time || b.add_time).getTime();
                return db - da;
            })
            .slice(0, limit);
    }, [activities, limit]);

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
        <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-4 rounded-full bg-blue-500/60"></span>
                    <div>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">O que fiz</h3>
                        <p className="text-[10px] text-gray-600 mt-0.5">Atividades concluídas</p>
                    </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
                    {totalDone} feitas
                </span>
            </div>

            {/* Resumo por tipo */}
            {typeStats.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5 pb-5 border-b border-white/[0.05]">
                    {typeStats.map(({ type, count, cfg }) => {
                        const Icon = cfg.icon;
                        return (
                            <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white/[0.03] border-white/[0.08] text-[10px] font-bold text-gray-400">
                                <Icon className="w-3 h-3 text-gray-500" />
                                {count}× {cfg.label}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Feed */}
            {feed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                    <Calendar className="w-7 h-7 text-gray-700" />
                    <p className="text-gray-600 text-[11px] font-bold">Sem atividades concluídas</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {feed.map(activity => {
                        const cfg = ACTIVITY_CONFIG[activity.type?.toLowerCase()] || DEFAULT_CFG;
                        const Icon = cfg.icon;
                        const dateStr = activity.marked_as_done_time || activity.add_time;

                        return (
                            <div key={activity.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
                                <div className="w-7 h-7 shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center">
                                    <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                                        {activity.subject || cfg.label}
                                    </p>
                                    <p className="text-[9px] text-gray-600 font-medium truncate mt-0.5">
                                        {cfg.label}
                                        {activity.deal_title && (
                                            <span className="text-gray-700"> · {activity.deal_title}</span>
                                        )}
                                    </p>
                                </div>

                                {/* Data absoluta + relativa */}
                                <div className="flex flex-col items-end gap-0.5 shrink-0">
                                    <span className="text-[10px] text-gray-400 font-bold tabular-nums capitalize">
                                        {absoluteDate(dateStr)}
                                    </span>
                                    <span className="text-[9px] text-gray-600 tabular-nums">
                                        {timeAgo(dateStr)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalDone > limit && (
                <p className="text-[10px] text-gray-700 text-center mt-4 border-t border-white/[0.05] pt-3">
                    +{totalDone - limit} anteriores
                </p>
            )}
        </div>
    );
}
