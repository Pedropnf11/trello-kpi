"use client";

import { useMemo } from 'react';
import { Activity } from '@/types/pipedrive';

interface HeatmapChartProps {
    activities: Activity[];
}

const DAYS  = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function HeatmapChart({ activities }: HeatmapChartProps) {
    const grid = useMemo(() => {
        const map: Record<string, number> = {};
        activities.forEach(a => {
            const dateStr = a.due_date || a.add_time?.split(' ')[0];
            const timeStr = a.due_time || a.add_time?.split(' ')[1] || '09:00:00';
            if (!dateStr) return;
            const d = new Date(`${dateStr}T${timeStr}`);
            if (isNaN(d.getTime())) return;
            const day  = d.getDay();
            const hour = d.getHours();
            if (hour < 8 || hour > 19) return;
            const key = `${day}-${hour}`;
            map[key] = (map[key] || 0) + 1;
        });
        return map;
    }, [activities]);

    const maxVal = useMemo(() => Math.max(1, ...Object.values(grid)), [grid]);

    const totalActivities = activities.length;
    const peakEntry = Object.entries(grid).sort((a, b) => b[1] - a[1])[0];
    const peakInfo = useMemo(() => {
        if (!peakEntry) return null;
        const [key] = peakEntry;
        const [day, hour] = key.split('-').map(Number);
        return { day: DAYS[day], hour: `${hour}h`, count: peakEntry[1] };
    }, [peakEntry]);

    // Retorna inline style com opacidade de azul baseada na intensidade
    const getCellStyle = (count: number): React.CSSProperties => {
        if (count === 0) return { background: 'var(--bg-surface)', border: '1px solid var(--border)' };
        const intensity = count / maxVal;
        const opacity = 0.15 + intensity * 0.85;
        return {
            background: `rgba(59,130,246,${opacity.toFixed(2)})`,
            border: `1px solid rgba(59,130,246,${(opacity * 0.6).toFixed(2)})`,
        };
    };

    return (
        <div className="card p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="w-1.5 h-4 rounded-full" style={{ background: 'var(--blue)' }}></span>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                            Heatmap de Produtividade
                        </h3>
                    </div>
                    <p className="text-[10px] ml-4" style={{ color: 'var(--text-muted)' }}>
                        Quando é que a equipa é mais activa?
                    </p>
                </div>
                <div className="flex items-center gap-4 text-right">
                    <div>
                        <p className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>{totalActivities}</p>
                        <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>atividades</p>
                    </div>
                    {peakInfo && (
                        <div className="pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
                            <p className="text-xs font-black" style={{ color: 'var(--blue)' }}>{peakInfo.day} {peakInfo.hour}</p>
                            <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>pico ({peakInfo.count})</p>
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
                            <div key={h} className="flex-1 text-center text-[9px] font-black uppercase tracking-tight" style={{ color: 'var(--text-muted)' }}>
                                {h}h
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="space-y-1">
                        {DAYS.map((day, dayIdx) => (
                            <div key={day} className="flex items-center gap-1">
                                <span className="w-9 text-[9px] font-black uppercase tracking-tight shrink-0 text-right pr-2" style={{ color: 'var(--text-muted)' }}>
                                    {day}
                                </span>
                                <div className="flex flex-1 gap-1">
                                    {HOURS.map(hour => {
                                        const count = grid[`${dayIdx}-${hour}`] || 0;
                                        return (
                                            <div
                                                key={hour}
                                                title={count > 0 ? `${DAYS[dayIdx]} ${hour}h — ${count} atividade${count !== 1 ? 's' : ''}` : ''}
                                                className="flex-1 aspect-square rounded-md transition-all duration-200 hover:scale-110 cursor-default"
                                                style={getCellStyle(count)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Legenda */}
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Menos</span>
                        {[0, 0.15, 0.30, 0.50, 0.70, 1.0].map((opacity, i) => (
                            <div key={i} className="w-4 h-4 rounded-sm"
                                style={{
                                    background: opacity === 0 ? 'var(--bg-surface)' : `rgba(59,130,246,${opacity})`,
                                    border: `1px solid ${opacity === 0 ? 'var(--border)' : `rgba(59,130,246,${opacity * 0.6})`}`,
                                }} />
                        ))}
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Mais</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
