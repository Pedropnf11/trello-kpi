"use client";

import { useMemo, useState } from 'react';
import { Deal, Stage } from '@/types/pipedrive';
import { ExternalLink, CheckCircle2, Clock, TrendingDown } from 'lucide-react';
import DetailModal, { DealModalData } from './DetailModal';

interface StuckLeadsProps {
    deals: Deal[];
    stages: Stage[];
    notes?: any[];          // notas já carregadas pela página pai
    userId?: number | null;
    onFollowUpCreated?: (dealId: number, newDate: string) => void;
}

const THRESHOLDS = [
    { label: '1d+',  days: 1  },
    { label: '7d+',  days: 7  },
    { label: '14d+', days: 14 },
    { label: '30d+', days: 30 },
];

type Filter = 1 | 7 | 14 | 30;

function getPriority(days: number): 'critical' | 'high' | 'medium' {
    if (days >= 30) return 'critical';
    if (days >= 14) return 'high';
    return 'medium';
}

const PRIORITY_STYLES = {
    critical: {
        text:  'text-rose-400',
        badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        label: 'Crítico',
        row:   'border-l-rose-500/60',
    },
    high: {
        text:  'text-rose-300/80',
        badge: 'bg-rose-500/8 border-rose-500/15 text-rose-300/80',
        label: 'Urgente',
        row:   'border-l-rose-400/40',
    },
    medium: {
        text:  'text-gray-400',
        badge: 'bg-white/5 border-white/10 text-gray-500',
        label: 'Parado',
        row:   'border-l-white/10',
    },
};

export default function StuckLeads({ deals, stages, notes = [], userId, onFollowUpCreated }: StuckLeadsProps) {
    const [minDays, setMinDays]           = useState<Filter>(1);
    const [selectedDeal, setSelectedDeal] = useState<DealModalData['deal'] | null>(null);
    const [localUpdates, setLocalUpdates] = useState<Record<number, string>>({});

    const now = new Date();

    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    const stuckItems = useMemo(() => {
        const myDeals = userId
            ? deals.filter(d => {
                const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(uid) === Number(userId) && d.status === 'open';
            })
            : deals.filter(d => d.status === 'open');

        return myDeals
            .map(d => {
                const ref = localUpdates[d.id] ?? d.last_activity_date ?? d.stage_change_time ?? d.add_time;
                const daysStuck = Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000);
                const stage = stages.find(s => s.id === d.stage_id);
                return {
                    id: d.id,
                    title: d.title,
                    value: d.value || 0,
                    daysStuck,
                    stageName: stage?.name || 'Pipeline',
                    priority: getPriority(daysStuck),
                    orgName:    d.org_id?.name,
                    personName: d.person_id?.name,
                };
            })
            .filter(d => d.daysStuck >= minDays)
            .sort((a, b) => b.daysStuck - a.daysStuck);
    }, [deals, stages, userId, minDays, localUpdates]);

    const thresholdCounts = useMemo(() =>
        THRESHOLDS.map(t => ({
            ...t,
            count: deals.filter(d => {
                const uid = userId
                    ? (() => { const u = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id; return Number(u) === Number(userId); })()
                    : true;
                if (!uid || d.status !== 'open') return false;
                const ref = localUpdates[d.id] ?? d.last_activity_date ?? d.stage_change_time ?? d.add_time;
                return Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000) >= t.days;
            }).length,
        })),
    [deals, userId, localUpdates]);

    const totalValueAtRisk = stuckItems.reduce((s, d) => s + d.value, 0);
    const criticalCount    = stuckItems.filter(d => d.priority === 'critical').length;

    // Última nota associada a um deal
    const lastNoteForDeal = (dealId: number): string | undefined => {
        const dealNotes = notes
            .filter(n => n.deal_id === dealId)
            .sort((a: any, b: any) => new Date(b.add_time).getTime() - new Date(a.add_time).getTime());
        return dealNotes[0]?.content;
    };

    const openModal = (item: typeof stuckItems[0]) => {
        setSelectedDeal({
            id:         item.id,
            title:      item.title,
            value:      item.value,
            stageName:  item.stageName,
            daysStuck:  item.daysStuck,
            orgName:    item.orgName,
            personName: item.personName,
            lastNote:   lastNoteForDeal(item.id),
        });
    };

    const handleFollowUpCreated = (dealId: number, dueDate: string) => {
        setLocalUpdates(prev => ({ ...prev, [dealId]: dueDate }));
        onFollowUpCreated?.(dealId, dueDate);
    };

    return (
        <>
            <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-white/[0.05]">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-4 rounded-full bg-rose-500/60"></span>
                            <div>
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">Leads Paradas</h3>
                                <p className="text-[9px] text-gray-600 mt-0.5">Clica para ver detalhes ou agendar follow-up</p>
                            </div>
                        </div>
                        {totalValueAtRisk > 0 && (
                            <div className="text-right">
                                <p className="text-sm font-black text-white">{fmt(totalValueAtRisk)}</p>
                                <p className="text-[9px] text-rose-400/70 font-bold uppercase tracking-widest flex items-center gap-1 justify-end mt-0.5">
                                    <TrendingDown className="w-3 h-3" /> em risco
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-2">
                        {thresholdCounts.map(t => (
                            <button
                                key={t.days}
                                onClick={() => setMinDays(t.days as Filter)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all ${
                                    minDays === t.days
                                        ? 'bg-white/10 border-white/20 text-white'
                                        : 'bg-white/[0.03] border-white/[0.06] text-gray-600 hover:bg-white/[0.06] hover:text-gray-400'
                                }`}
                            >
                                <Clock className="w-2.5 h-2.5" />
                                {t.label}
                                {t.count > 0 && (
                                    <span className={`ml-0.5 px-1.5 rounded-full text-[9px] font-black ${
                                        minDays === t.days ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {t.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[460px] overflow-y-auto">
                    {stuckItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-3 px-6">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-bold">Pipeline activo</p>
                                <p className="text-gray-600 text-[10px] mt-1">
                                    Sem negócios parados há mais de {minDays} dia{minDays !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.03]">
                            {stuckItems.map(item => {
                                const style = PRIORITY_STYLES[item.priority];
                                const hasFollowUp = !!localUpdates[item.id];
                                const hasNote = !!lastNoteForDeal(item.id);

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => openModal(item)}
                                        className={`w-full text-left flex items-center gap-4 px-5 py-3.5 border-l-2 ${style.row} hover:bg-white/[0.03] transition-all group`}
                                    >
                                        {/* Days indicator */}
                                        <div className="shrink-0 w-8 text-center">
                                            <p className={`text-[13px] font-black leading-none ${style.text}`}>{item.daysStuck}</p>
                                            <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest mt-0.5">dias</p>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                                                {item.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-[10px] text-gray-600 truncate">{item.stageName}</p>
                                                {hasFollowUp && (
                                                    <span className="text-[9px] text-green-400/70 font-bold shrink-0">· follow-up ✓</span>
                                                )}
                                                {hasNote && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shrink-0" title="Tem nota" />
                                                )}
                                                {item.orgName && (
                                                    <span className="text-[9px] text-gray-700 truncate shrink-0">{item.orgName}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Value + badge */}
                                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                            <span className="text-[11px] font-black text-gray-300">
                                                {item.value > 0 ? fmt(item.value) : '—'}
                                            </span>
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${style.badge}`}>
                                                {style.label}
                                            </span>
                                        </div>

                                        {/* Hint */}
                                        <ExternalLink className="w-3 h-3 text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {stuckItems.length > 0 && (
                    <div className="px-6 py-3 border-t border-white/[0.05] flex items-center justify-between">
                        <p className="text-[10px] text-gray-600">
                            <span className="text-gray-300 font-bold">{stuckItems.length}</span> negócio{stuckItems.length !== 1 ? 's' : ''} parado{stuckItems.length !== 1 ? 's' : ''}
                            {criticalCount > 0 && (
                                <span className="text-rose-400/80 font-bold ml-1">· {criticalCount} crítico{criticalCount !== 1 ? 's' : ''}</span>
                            )}
                        </p>
                        <p className="text-[10px] text-gray-700">
                            ≥ <span className="text-gray-500 font-bold">{minDays} dia{minDays !== 1 ? 's' : ''}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de detalhe do deal */}
            {selectedDeal && (
                <DetailModal
                    data={{ mode: 'deal', deal: selectedDeal }}
                    onClose={() => setSelectedDeal(null)}
                    onFollowUpCreated={handleFollowUpCreated}
                />
            )}
        </>
    );
}
