"use client";

import { useMemo, useState } from 'react';
import { Activity } from '@/types/pipedrive';
import {
    Phone, Mail, Users, CheckSquare, Clock,
    AlertTriangle, Calendar, CheckCircle2,
} from 'lucide-react';
import DetailModal from './DetailModal';

interface TodaysFocusProps {
    activities: Activity[];
    onActivityUpdated?: (activityId: number, changes: Partial<Activity>) => void;
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
    call:     { icon: Phone,       label: 'Chamada'  },
    email:    { icon: Mail,        label: 'Email'    },
    meeting:  { icon: Users,       label: 'Reunião'  },
    task:     { icon: CheckSquare, label: 'Tarefa'   },
    deadline: { icon: Clock,       label: 'Prazo'    },
};
const DEFAULT_CONFIG = { icon: CheckSquare, label: 'Atividade' };

function timeLabel(dateStr: string): string {
    const now = new Date();
    const d = new Date(dateStr);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays < 0) { const f = Math.abs(diffDays); return f === 1 ? 'amanhã' : `daqui a ${f}d`; }
    if (diffDays === 0) return 'hoje';
    if (diffDays === 1) return 'ontem';
    return `há ${diffDays}d`;
}

export default function TodaysFocus({ activities, onActivityUpdated }: TodaysFocusProps) {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    // Override local para actividades remarcadas ou marcadas como feitas — sem re-fetch
    const [localOverrides, setLocalOverrides] = useState<Record<number, Partial<Activity>>>({});

    const mergedActivities = useMemo(() =>
        activities.map(a => ({ ...a, ...localOverrides[a.id] })),
    [activities, localOverrides]);

    const overdue = useMemo(() => mergedActivities
        .filter(a => !a.done && a.due_date && a.due_date < todayStr)
        .sort((a, b) => a.due_date.localeCompare(b.due_date))
        .slice(0, 8), [mergedActivities, todayStr]);

    const dueToday = useMemo(() => mergedActivities
        .filter(a => !a.done && a.due_date === todayStr)
        .slice(0, 8), [mergedActivities, todayStr]);

    const totalUrgent = overdue.length + dueToday.length;

    const handleRescheduled = (activityId: number, newDate: string, newTime?: string) => {
        const override: Partial<Activity> = { due_date: newDate };
        if (newTime) override.due_time = newTime;
        setLocalOverrides(prev => ({ ...prev, [activityId]: { ...prev[activityId], ...override } }));
        onActivityUpdated?.(activityId, override);
    };

    const handleDone = (activityId: number) => {
        setLocalOverrides(prev => ({ ...prev, [activityId]: { ...prev[activityId], done: true } }));
        onActivityUpdated?.(activityId, { done: true });
    };

    const ActivityRow = ({ a, isOverdue }: { a: Activity; isOverdue: boolean }) => {
        const cfg = ACTIVITY_CONFIG[a.type?.toLowerCase()] || DEFAULT_CONFIG;
        const Icon = cfg.icon;
        return (
            <button
                onClick={() => setSelectedActivity(a)}
                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all group cursor-pointer ${
                    isOverdue
                        ? 'bg-rose-500/[0.04] border-rose-500/10 hover:border-rose-500/30 hover:bg-rose-500/[0.08]'
                        : 'bg-white/[0.02] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.05]'
                }`}
            >
                <div className={`w-7 h-7 shrink-0 rounded-lg border flex items-center justify-center ${
                    isOverdue ? 'bg-rose-500/8 border-rose-500/15' : 'bg-white/[0.04] border-white/[0.08]'
                }`}>
                    <Icon className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400/70' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                        {a.subject}
                    </p>
                    <p className="text-[9px] text-gray-600 truncate mt-0.5">
                        {cfg.label}
                        <span className={`ml-1 ${isOverdue ? 'text-rose-400/60' : 'text-gray-500'}`}>
                            · {timeLabel(a.due_date)}
                        </span>
                        {a.deal_title && <span className="text-gray-700 ml-1">· {a.deal_title}</span>}
                        {a.due_time && <span className="text-gray-700 ml-1">às {a.due_time.slice(0, 5)}</span>}
                    </p>
                </div>
                {/* Indicador de que tem nota */}
                {a.note && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500/60" title="Tem nota" />
                )}
                {/* Hint de clique */}
                <span className="text-[9px] text-gray-700 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    ver →
                </span>
            </button>
        );
    };

    return (
        <>
            <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-4 rounded-full ${totalUrgent > 0 ? 'bg-rose-500/60' : 'bg-white/20'}`}></span>
                        <div>
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">O que me falta</h3>
                            <p className="text-[9px] text-gray-600 mt-0.5">Clica para ver detalhes ou remarcar</p>
                        </div>
                    </div>
                    {totalUrgent > 0 ? (
                        <span className="text-[10px] font-black text-rose-400/80 bg-rose-500/8 border border-rose-500/15 px-2.5 py-1 rounded-full">
                            {totalUrgent} pendente{totalUrgent !== 1 ? 's' : ''}
                        </span>
                    ) : (
                        <span className="text-[10px] font-black text-gray-500 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
                            Tudo em dia ✓
                        </span>
                    )}
                </div>

                <div className="p-4 space-y-5 max-h-[540px] overflow-y-auto">
                    {overdue.length > 0 && (
                        <div>
                            <p className="text-[9px] font-black text-rose-400/70 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3 h-3" /> Atrasados
                            </p>
                            <div className="space-y-1.5">
                                {overdue.map(a => <ActivityRow key={a.id} a={a} isOverdue={true} />)}
                            </div>
                        </div>
                    )}

                    {dueToday.length > 0 && (
                        <div>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> Para hoje
                            </p>
                            <div className="space-y-1.5">
                                {dueToday.map(a => <ActivityRow key={a.id} a={a} isOverdue={false} />)}
                            </div>
                        </div>
                    )}

                    {totalUrgent === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-gray-300 text-sm font-bold">Estás em dia</p>
                                <p className="text-gray-600 text-[10px] mt-1">Sem tarefas atrasadas para hoje.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de detalhe */}
            {selectedActivity && (
                <DetailModal
                    data={{ mode: 'activity', activity: selectedActivity }}
                    onClose={() => setSelectedActivity(null)}
                    onActivityRescheduled={handleRescheduled}
                    onActivityDone={handleDone}
                />
            )}
        </>
    );
}
