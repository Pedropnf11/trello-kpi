"use client";

import { useMemo } from 'react';
import { Activity } from '@/types/pipedrive';
import { Phone, Mail, Users, CheckSquare, Clock, ExternalLink, Calendar } from 'lucide-react';

interface ActivityTimelineProps {
    activities: Activity[];
    limit?: number;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    call:     { icon: Phone,       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20',   label: 'Chamada'  },
    email:    { icon: Mail,        color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Email' },
    meeting:  { icon: Users,       color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20', label: 'Reunião' },
    task:     { icon: CheckSquare, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Tarefa'  },
    deadline: { icon: Clock,       color: 'text-rose-400',   bg: 'bg-rose-500/10 border-rose-500/20',   label: 'Prazo'   },
    lunch:    { icon: Calendar,    color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Almoço' },
};

const DEFAULT_CONFIG = { icon: CheckSquare, color: 'text-gray-400', bg: 'bg-white/5 border-white/10', label: 'Atividade' };

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins}min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return 'ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}

export default function ActivityTimeline({ activities, limit = 12 }: ActivityTimelineProps) {
    const sorted = useMemo(() => {
        return [...activities]
            .sort((a, b) => {
                const dateA = new Date(a.marked_as_done_time || a.add_time).getTime();
                const dateB = new Date(b.marked_as_done_time || b.add_time).getTime();
                return dateB - dateA;
            })
            .slice(0, limit);
    }, [activities, limit]);

    const doneCount = activities.filter(a => a.done).length;
    const pendingCount = activities.filter(a => !a.done).length;

    return (
        <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-400 to-violet-600"></span>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">Timeline de Atividades</h3>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1 ml-4">Histórico recente de interações</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {doneCount} feitas
                    </span>
                    {pendingCount > 0 && (
                        <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                            {pendingCount} pendentes
                        </span>
                    )}
                </div>
            </div>

            {/* Timeline */}
            {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Sem atividades registadas</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-3">
                        {sorted.map((activity, index) => {
                            const config = ACTIVITY_CONFIG[activity.type?.toLowerCase()] || DEFAULT_CONFIG;
                            const Icon = config.icon;
                            const isDone = activity.done;
                            const dateStr = activity.marked_as_done_time || activity.add_time;

                            return (
                                <div key={activity.id} className="flex items-start gap-3 group">
                                    {/* Icon bubble */}
                                    <div className={`relative z-10 w-9 h-9 shrink-0 rounded-full border flex items-center justify-center transition-transform group-hover:scale-110 ${config.bg}`}>
                                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                                        {isDone && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-[#0f1115] flex items-center justify-center">
                                                <svg viewBox="0 0 10 10" className="w-2 h-2 fill-white">
                                                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-black text-white truncate group-hover:text-blue-400 transition-colors">
                                                    {activity.subject || config.label}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                    {activity.deal_title && (
                                                        <>
                                                            <span className="text-gray-700">·</span>
                                                            <span className="text-[9px] text-gray-500 truncate max-w-[120px]">
                                                                {activity.deal_title}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[9px] text-gray-600 font-bold shrink-0 whitespace-nowrap">
                                                {timeAgo(dateStr)}
                                            </span>
                                        </div>

                                        {activity.note && (
                                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 italic">
                                                "{activity.note}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activities.length > limit && (
                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 font-bold">
                        +{activities.length - limit} atividades anteriores
                    </p>
                </div>
            )}
        </div>
    );
}
