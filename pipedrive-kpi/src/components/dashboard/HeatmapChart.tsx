"use client";

import { useMemo } from 'react';
import { Activity } from '@/types/pipedrive';

interface HeatmapChartProps {
    activities: Activity[];
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function HeatmapChart({ activities }: HeatmapChartProps) {
    // Build grid: day (0-6) x hour (8-19) → count
    const grid = useMemo(() => {
        const map: Record<string, number> = {};

        activities.forEach(a => {
            // Use due_date + due_time or add_time for positioning
            const dateStr = a.due_date || a.add_time?.split(' ')[0];
            const timeStr = a.due_time || a.add_time?.split(' ')[1] || '09:00:00';

            if (!dateStr) return;

            const dateObj = new Date(`${dateStr}T${timeStr}`);
            if (isNaN(dateObj.getTime())) return;

            const day = dateObj.getDay();   // 0 = Sunday
            const hour = dateObj.getHours(); // 0-23

            if (hour < 8 || hour > 19) return;

            const key = `${day}-${hour}`;
            map[key] = (map[key] || 0) + 1;
        });

        return map;
    }, [activities]);

    const maxVal = useMemo(() => Math.max(1, ...Object.values(grid)), [grid]);

    // Total and peak cell info
    const totalActivities = activities.length;
    const peakEntry = Object.entries(grid).sort((a, b) => b[1] - a[1])[0];
    const peakInfo = useMemo(() => {
        if (!peakEntry) return null;
        const [key] = peakEntry;
        const [day, hour] = key.split('-').map(Number);
        return { day: DAYS[day], hour: `${hour}h`, count: peakEntry[1] };
    }, [peakEntry]);

    const getColor = (count: number): string => {
        if (count === 0) return 'bg-white/[0.03]';
        const intensity = count / maxVal;
        if (intensity < 0.2)  return 'bg-blue-500/15';
        if (intensity < 0.4)  return 'bg-blue-500/30';
        if (intensity < 0.6)  return 'bg-blue-500/50';
        if (intensity < 0.8)  return 'bg-blue-500/70';
        return 'bg-blue-500';
    };

    const getBorder = (count: number): string => {
        if (count === 0) return 'border-white/[0.04]';
        const intensity = count / maxVal;
        if (intensity < 0.4) return 'border-blue-500/10';
        if (intensity < 0.7) return 'border-blue-500/30';
        return 'border-blue-400/50';
    };

    return (
        <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600"></span>
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">Heatmap de Produtividade</h3>
                    </div>
                    <p className="text-[10px] text-gray-600 ml-4">Quando é que a equipa é mais ativa?</p>
                </div>
                <div className="flex items-center gap-3 text-right">
                    <div>
                        <p className="text-xs font-black text-white">{totalActivities}</p>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">atividades</p>
                    </div>
                    {peakInfo && (
                        <div className="pl-3 border-l border-white/10">
                            <p className="text-xs font-black text-blue-400">{peakInfo.day} {peakInfo.hour}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-widest">pico ({peakInfo.count})</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[480px]">
                    {/* Hour labels */}
                    <div className="flex mb-1.5 ml-10">
                        {HOURS.map(h => (
                            <div key={h} className="flex-1 text-center text-[9px] font-black text-gray-600 uppercase tracking-tight">
                                {h}h
                            </div>
                        ))}
                    </div>

                    {/* Rows: each day */}
                    <div className="space-y-1">
                        {DAYS.map((day, dayIdx) => (
                            <div key={day} className="flex items-center gap-1">
                                <span className="w-9 text-[9px] font-black text-gray-500 uppercase tracking-tight shrink-0 text-right pr-2">
                                    {day}
                                </span>
                                <div className="flex flex-1 gap-1">
                                    {HOURS.map(hour => {
                                        const count = grid[`${dayIdx}-${hour}`] || 0;
                                        return (
                                            <div
                                                key={hour}
                                                title={count > 0 ? `${DAYS[dayIdx]} ${hour}h — ${count} atividade${count !== 1 ? 's' : ''}` : ''}
                                                className={`flex-1 aspect-square rounded-md border transition-all duration-200 hover:scale-110 hover:brightness-125 cursor-default ${getColor(count)} ${getBorder(count)}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Menos</span>
                        {['bg-white/[0.03]', 'bg-blue-500/15', 'bg-blue-500/30', 'bg-blue-500/50', 'bg-blue-500/70', 'bg-blue-500'].map((c, i) => (
                            <div key={i} className={`w-4 h-4 rounded-sm border border-white/10 ${c}`} />
                        ))}
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Mais</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
