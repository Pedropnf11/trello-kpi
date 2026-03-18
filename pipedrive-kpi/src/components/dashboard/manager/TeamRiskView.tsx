"use client";

import { useMemo, useState } from 'react';
import { Deal, Stage, PipedriveUser } from '@/types/pipedrive';
import { ExternalLink, TrendingDown, Clock, Phone, Mail, Users, CheckCircle2 } from 'lucide-react';
import DetailModal, { DealModalData } from '../DetailModal';

interface TeamRiskViewProps {
    deals: Deal[];
    stages: Stage[];
    viewUsers: PipedriveUser[];
    notes?: any[];
    onFollowUpCreated?: (dealId: number, dueDate: string) => void;
}

const THRESHOLDS = [
    { label: '1d+',  days: 1  },
    { label: '7d+',  days: 7  },
    { label: '14d+', days: 14 },
    { label: '30d+', days: 30 },
] as const;

type Filter = 1 | 7 | 14 | 30;

function getActionSuggestion(days: number): { label: string; icon: React.ElementType; color: string } {
    if (days >= 30) return { label: 'Reunião presencial', icon: Users, color: 'var(--rose)'   };
    if (days >= 14) return { label: 'Chamada urgente',    icon: Phone, color: 'var(--orange)' };
    return              { label: 'Enviar email',          icon: Mail,  color: 'var(--blue)'   };
}

function getPriority(days: number): 'critical' | 'high' | 'medium' {
    if (days >= 30) return 'critical';
    if (days >= 14) return 'high';
    return 'medium';
}

// Cores codificadas como CSS variables para consistência com o design system
const PRIORITY_BORDER = {
    critical: 'rgba(244,63,94,0.6)',
    high:     'rgba(245,158,11,0.5)',
    medium:   'rgba(255,255,255,0.08)',
};

const PRIORITY_TEXT = {
    critical: 'var(--rose)',
    high:     'var(--orange)',
    medium:   'var(--text-secondary)',
};

export default function TeamRiskView({ deals, stages, viewUsers, notes = [], onFollowUpCreated }: TeamRiskViewProps) {
    const [minDays, setMinDays]           = useState<Filter>(7);
    const [selectedDeal, setSelectedDeal] = useState<DealModalData['deal'] | null>(null);
    const [localUpdates, setLocalUpdates] = useState<Record<number, string>>({});
    const now = new Date();

    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    const userMap = useMemo(() => {
        const m = new Map<number, string>();
        viewUsers.forEach(u => m.set(u.id, u.name));
        return m;
    }, [viewUsers]);

    const stuckItems = useMemo(() => {
        return deals
            .filter(d => d.status === 'open')
            .map(d => {
                const uid = typeof d.user_id === 'object' ? d.user_id?.id : (d.user_id as any);
                const ref = localUpdates[d.id] ?? d.last_activity_date ?? d.stage_change_time ?? d.add_time;
                const daysStuck = Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000);
                const stage     = stages.find(s => s.id === d.stage_id);
                const ownerName = userMap.get(Number(uid)) ?? 'Sem dono';
                return {
                    id: d.id, title: d.title, value: d.value || 0,
                    daysStuck, stageName: stage?.name || 'Pipeline',
                    priority: getPriority(daysStuck),
                    orgName: d.org_id?.name, personName: d.person_id?.name,
                    ownerId: Number(uid), ownerName,
                    ownerInitials: ownerName.substring(0, 2).toUpperCase(),
                };
            })
            .filter(d => d.daysStuck >= minDays)
            .sort((a, b) => {
                const po = { critical: 0, high: 1, medium: 2 };
                if (po[a.priority] !== po[b.priority]) return po[a.priority] - po[b.priority];
                return b.daysStuck - a.daysStuck;
            });
    }, [deals, stages, userMap, minDays, localUpdates]);

    const thresholdCounts = useMemo(() =>
        THRESHOLDS.map(t => ({
            ...t,
            count: deals.filter(d => {
                if (d.status !== 'open') return false;
                const ref = localUpdates[d.id] ?? d.last_activity_date ?? d.stage_change_time ?? d.add_time;
                return Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000) >= t.days;
            }).length,
        })),
    [deals, localUpdates]);

    const totalValueAtRisk = stuckItems.reduce((s, d) => s + d.value, 0);
    const criticalCount    = stuckItems.filter(d => d.priority === 'critical').length;

    const lastNoteForDeal = (dealId: number) =>
        notes
            .filter(n => n.deal_id === dealId)
            .sort((a: any, b: any) => new Date(b.add_time).getTime() - new Date(a.add_time).getTime())[0]?.content as string | undefined;

    const openModal = (item: typeof stuckItems[0]) =>
        setSelectedDeal({
            id: item.id, title: item.title, value: item.value,
            stageName: item.stageName, daysStuck: item.daysStuck,
            orgName: item.orgName, personName: item.personName,
            lastNote: lastNoteForDeal(item.id),
            ownerName: item.ownerName, ownerId: item.ownerId,
        });

    const handleFollowUpCreated = (dealId: number, dueDate: string) => {
        setLocalUpdates(prev => ({ ...prev, [dealId]: dueDate }));
        onFollowUpCreated?.(dealId, dueDate);
    };

    return (
        <>
            <div className="card overflow-hidden">

                {/* Header */}
                <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-4 rounded-full shrink-0" style={{ background: 'var(--rose)' }}></span>
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                                    Vista de Risco da Equipa
                                </h3>
                                <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    Clica para agendar follow-up · sugestão automática por dias
                                </p>
                            </div>
                        </div>
                        {totalValueAtRisk > 0 && (
                            <div className="text-right shrink-0 ml-4">
                                <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>{fmt(totalValueAtRisk)}</p>
                                <p className="text-[9px] font-bold flex items-center gap-1 justify-end mt-0.5" style={{ color: 'var(--rose)' }}>
                                    <TrendingDown className="w-3 h-3" /> em risco
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {thresholdCounts.map(t => {
                            const active = minDays === t.days;
                            return (
                                <button key={t.days} onClick={() => setMinDays(t.days as Filter)}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black transition-all"
                                    style={{
                                        background: active ? 'var(--bg-hover)' : 'var(--bg-surface)',
                                        color:      active ? 'var(--text-primary)' : 'var(--text-muted)',
                                        border:     `1px solid ${active ? 'var(--border-mid)' : 'var(--border)'}`,
                                    }}>
                                    <Clock className="w-2.5 h-2.5" />
                                    {t.label}
                                    {t.count > 0 && (
                                        <span className="px-1.5 rounded-full text-[9px] font-black"
                                            style={{ background: active ? 'rgba(255,255,255,0.1)' : 'var(--bg-hover)', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            {t.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Lista */}
                <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                    {stuckItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-6">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                            </div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Equipa activa</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                Sem negócios parados há mais de {minDays}d.
                            </p>
                        </div>
                    ) : (
                        <div style={{ borderTop: '1px solid var(--border)' }}>
                            {stuckItems.map(item => {
                                const action     = getActionSuggestion(item.daysStuck);
                                const ActionIcon = action.icon;
                                const hasFollowUp = !!localUpdates[item.id];

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => openModal(item)}
                                        className="w-full text-left flex items-center gap-3 px-5 py-3.5 transition-all group"
                                        style={{
                                            borderLeft: `2px solid ${PRIORITY_BORDER[item.priority]}`,
                                            borderBottom: '1px solid var(--border)',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {/* Dias */}
                                        <div className="shrink-0 w-8 text-center">
                                            <p className="text-[13px] font-black leading-none" style={{ color: PRIORITY_TEXT[item.priority] }}>{item.daysStuck}</p>
                                            <p className="text-[8px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>dias</p>
                                        </div>

                                        {/* Avatar dono */}
                                        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black"
                                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                            {item.ownerInitials}
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{item.stageName}</span>
                                                <span style={{ color: 'var(--text-muted)' }} className="text-[9px]">·</span>
                                                <span className="text-[10px] font-bold truncate" style={{ color: 'var(--text-secondary)' }}>{item.ownerName}</span>
                                                {hasFollowUp && <span className="text-[9px] font-bold shrink-0" style={{ color: 'var(--green)' }}>· ✓</span>}
                                            </div>
                                        </div>

                                        {/* Valor + sugestão */}
                                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                                            <span className="text-[11px] font-black" style={{ color: 'var(--text-primary)' }}>
                                                {item.value > 0 ? fmt(item.value) : '—'}
                                            </span>
                                            <span className="flex items-center gap-1 text-[9px] font-black" style={{ color: action.color }}>
                                                <ActionIcon className="w-2.5 h-2.5" />
                                                {action.label}
                                            </span>
                                        </div>

                                        <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {stuckItems.length > 0 && (
                    <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{stuckItems.length}</span>{' '}
                            parado{stuckItems.length !== 1 ? 's' : ''}
                            {criticalCount > 0 && <span className="font-bold ml-1" style={{ color: 'var(--rose)' }}>· {criticalCount} crítico{criticalCount !== 1 ? 's' : ''}</span>}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            ≥ <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>{minDays}d</span>
                        </p>
                    </div>
                )}
            </div>

            {selectedDeal && (
                <DetailModal
                    data={{ mode: 'deal', deal: selectedDeal }}
                    onClose={() => setSelectedDeal(null)}
                    onFollowUpCreated={handleFollowUpCreated}
                    viewUsers={viewUsers}
                />
            )}
        </>
    );
}
