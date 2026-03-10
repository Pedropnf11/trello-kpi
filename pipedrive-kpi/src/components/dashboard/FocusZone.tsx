"use client";

import { AlertCircle, Clock, ExternalLink, Flame, Thermometer, Snowflake, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';

interface FocusItem {
    id: number;
    title: string;
    value: number;
    stage: string;
    daysStuck: number;
    priority: 'critical' | 'high' | 'medium';
    url: string;
}

interface FocusZoneProps {
    deals: any[];
    stages: any[];
    memberId?: number;
}

export default function FocusZone({ deals, stages, memberId }: FocusZoneProps) {
    const focusItems = useMemo(() => {
        const now = new Date();
        const items: FocusItem[] = [];

        if (!deals || !Array.isArray(deals)) return [];

        // Filter deals by member if provided
        const filteredDeals = memberId
            ? deals.filter(d => {
                // Pipedrive can return user_id as an object or just an ID
                const dealUserId = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(dealUserId) === Number(memberId);
            })
            : deals;

        // Skip won/lost for focus zone
        const activeDeals = filteredDeals.filter(d => d.status === 'open');

        activeDeals.forEach(deal => {
            // Determine "stuckness"
            // Pipedrive fields can be tricky. last_activity_date is usually there.
            const lastActivityDate = deal.last_activity_date;
            const updateTime = deal.update_time;
            const addTime = deal.add_time;

            const referenceDate = lastActivityDate
                ? new Date(lastActivityDate)
                : (updateTime ? new Date(updateTime) : new Date(addTime));

            if (isNaN(referenceDate.getTime())) return;

            const daysStuck = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));

            // Include all active deals in Focus Zone for better visibility
            // Different priorities based on days stuck
            const stage = stages?.find(s => Number(s.id) === Number(deal.stage_id));
            let priority: 'critical' | 'high' | 'medium' = 'medium';

            if (daysStuck > 15) priority = 'critical';
            else if (daysStuck > 7) priority = 'high';

            items.push({
                id: deal.id,
                title: deal.title,
                value: deal.value || 0,
                stage: stage ? stage.name : 'Pipeline',
                daysStuck,
                priority,
                url: `https://app.pipedrive.com/deal/${deal.id}`
            });
        });

        // Sort by priority and then by days stuck
        const priorityOrder = { critical: 0, high: 1, medium: 2 };
        return items.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return b.daysStuck - a.daysStuck;
        });
    }, [deals, stages, memberId]);

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'critical':
                return {
                    border: 'border-rose-500/50',
                    bg: 'bg-rose-500/5',
                    text: 'text-rose-500',
                    icon: <Flame className="w-3.5 h-3.5" />,
                    label: 'Crítico'
                };
            case 'high':
                return {
                    border: 'border-orange-500/50',
                    bg: 'bg-orange-500/5',
                    text: 'text-orange-400',
                    icon: <Thermometer className="w-3.5 h-3.5" />,
                    label: 'Urgente'
                };
            default:
                return {
                    border: 'border-yellow-500/50',
                    bg: 'bg-yellow-500/5',
                    text: 'text-yellow-400',
                    icon: <Snowflake className="w-3.5 h-3.5" />,
                    label: 'Atenção'
                };
        }
    };

    return (
        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/[0.04] flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-4 rounded-full bg-rose-500"></span>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">FOCUS ZONE</h3>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        {focusItems.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar-dark">
                {focusItems.length > 0 ? (
                    focusItems.map((item) => {
                        const style = getPriorityStyles(item.priority);
                        return (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block relative p-4 rounded-xl border-l-4 ${style.border} ${style.bg} border-t border-r border-b border-white/[0.03] hover:border-white/[0.08] transition-all group`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${style.text}`}>
                                        {style.icon}
                                        {style.label}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight truncate max-w-[120px]">
                                        {item.stage}
                                    </span>
                                </div>
                                <h4 className="font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                                    {item.title}
                                </h4>
                                <div className="flex justify-between items-center">
                                    <p className="text-[11px] text-gray-500 font-medium">
                                        Parado há {item.daysStuck} dias
                                    </p>
                                    <span className="text-[11px] font-black text-gray-300">
                                        {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.value)}
                                    </span>
                                </div>
                                <ExternalLink className="absolute top-4 right-4 w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tudo limpo! ✓</p>
                    </div>
                )}
            </div>
        </div>
    );
}


