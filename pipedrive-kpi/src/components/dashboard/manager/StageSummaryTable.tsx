"use client";

import { useMemo, useState } from 'react';
import { Deal, Stage, Activity, PipedriveUser } from '@/types/pipedrive';
import { Phone, Mail, Users, MessageSquare, Clock, ArrowUpDown } from 'lucide-react';

interface StageSummaryTableProps {
    deals: Deal[];
    stages: Stage[];
    activities: Activity[];
    notes: any[];
    viewUsers: PipedriveUser[];
}

type SortKey = 'deals' | 'value' | 'calls' | 'emails' | 'meetings' | 'notes' | 'avgDays';
type SortDir = 'asc' | 'desc';

export default function StageSummaryTable({ deals, stages, activities, notes, viewUsers }: StageSummaryTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>('deals');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const now = new Date();

    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    const rows = useMemo(() => {
        return stages.map(stage => {
            const openDeals = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
            if (openDeals.length === 0) return null;
            const dealIds   = new Set(openDeals.map(d => d.id));
            const stageActs = activities.filter(a => a.done && a.deal_id !== null && dealIds.has(a.deal_id as number));
            const avgDays   = Math.round(
                openDeals.reduce((sum, d) => {
                    const ref = d.last_activity_date || d.stage_change_time || d.add_time;
                    return sum + Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000);
                }, 0) / openDeals.length
            );
            return {
                id:       stage.id,
                name:     stage.name,
                count:    openDeals.length,
                value:    openDeals.reduce((s, d) => s + (d.value || 0), 0),
                calls:    stageActs.filter(a => a.type?.toLowerCase() === 'call').length,
                emails:   stageActs.filter(a => a.type?.toLowerCase() === 'email').length,
                meetings: stageActs.filter(a => a.type?.toLowerCase() === 'meeting').length,
                notes:    notes.filter(n => n.deal_id !== null && dealIds.has(n.deal_id)).length,
                avgDays,
            };
        }).filter(Boolean) as NonNullable<ReturnType<typeof stages['map']>[0]>[];
    }, [deals, stages, activities, notes]);

    const sortedRows = useMemo(() =>
        [...rows].sort((a: any, b: any) =>
            sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
        ),
    [rows, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const totals = useMemo(() => rows.reduce(
        (acc: any, r: any) => ({
            count:    acc.count    + r.count,
            value:    acc.value    + r.value,
            calls:    acc.calls    + r.calls,
            emails:   acc.emails   + r.emails,
            meetings: acc.meetings + r.meetings,
            notes:    acc.notes    + r.notes,
        }),
        { count: 0, value: 0, calls: 0, emails: 0, meetings: 0, notes: 0 }
    ), [rows]);

    const daysColor = (d: number): string => d <= 7 ? 'var(--green)' : d <= 14 ? 'var(--orange)' : 'var(--rose)';

    // Cabeçalho com ordenação
    const SortHeader = ({
        label, sortK, icon: Icon, align = 'center',
    }: {
        label: string; sortK: SortKey; icon?: React.ElementType; align?: 'center' | 'left';
    }) => (
        <th
            className="py-3 px-4 cursor-pointer select-none"
            style={{ textAlign: align }}
            onClick={() => toggleSort(sortK)}
        >
            <span
                className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-colors ${align === 'center' ? 'justify-center' : ''}`}
                style={{ color: sortKey === sortK ? 'var(--blue)' : 'var(--text-muted)' }}
            >
                {Icon && <Icon className="w-3 h-3 shrink-0" />}
                {label}
                <ArrowUpDown className="w-2.5 h-2.5 shrink-0" style={{ opacity: sortKey === sortK ? 1 : 0.3 }} />
            </span>
        </th>
    );

    const NumCell = ({ value, accent }: { value: number; accent?: boolean }) => (
        <td className="px-4 py-4 text-center">
            {value > 0 ? (
                <span
                    className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-lg text-[11px] font-black"
                    style={{
                        background: accent ? 'var(--blue-dim)' : 'var(--bg-surface)',
                        color:      accent ? 'var(--blue)' : 'var(--text-secondary)',
                        border:     `1px solid ${accent ? 'rgba(59,130,246,0.2)' : 'var(--border)'}`,
                    }}
                >
                    {value}
                </span>
            ) : (
                <span style={{ color: 'var(--text-muted)' }}>—</span>
            )}
        </td>
    );

    return (
        <div className="card overflow-hidden w-full">

            {/* Header do card */}
            <div className="px-6 pt-5 pb-4 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="w-1.5 h-4 rounded-full shrink-0" style={{ background: 'var(--blue)' }} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                    Resumo por Stage
                </h3>
                <span
                    className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                    {totals.count} abertos
                </span>
            </div>

            {rows.length === 0 ? (
                <div className="px-6 py-12 text-center text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                    Sem deals em aberto
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {/* Stage tem largura livre — as colunas numéricas têm largura fixa */}
                                <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)', minWidth: '180px' }}>
                                    Stage
                                </th>
                                <SortHeader label="Deals"    sortK="deals"    />
                                <SortHeader label="Valor"    sortK="value"    />
                                <SortHeader label="Chamadas" sortK="calls"    icon={Phone}         />
                                <SortHeader label="Emails"   sortK="emails"   icon={Mail}          />
                                <SortHeader label="Reuniões" sortK="meetings" icon={Users}         />
                                <SortHeader label="Notas"    sortK="notes"    icon={MessageSquare} />
                                <SortHeader label="Dias méd." sortK="avgDays" icon={Clock}         />
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRows.map((row: any) => (
                                <tr
                                    key={row.id}
                                    style={{ borderBottom: '1px solid var(--border)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Nome do stage */}
                                    <td className="px-6 py-4">
                                        <span className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {row.name}
                                        </span>
                                    </td>

                                    <NumCell value={row.count} accent />

                                    {/* Valor — alinhado ao centro para consistência */}
                                    <td className="px-4 py-4 text-center">
                                        <span className="text-[12px] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>
                                            {fmt(row.value)}
                                        </span>
                                    </td>

                                    <NumCell value={row.calls}    />
                                    <NumCell value={row.emails}   />
                                    <NumCell value={row.meetings} />
                                    <NumCell value={row.notes}    />

                                    {/* Dias médios com cor semântica */}
                                    <td className="px-4 py-4 text-center">
                                        <span
                                            className="inline-flex items-center justify-center min-w-[3rem] h-6 px-2.5 rounded-lg text-[11px] font-black tabular-nums"
                                            style={{
                                                color:      daysColor(row.avgDays),
                                                background: row.avgDays <= 7 ? 'rgba(16,185,129,0.08)'
                                                          : row.avgDays <= 14 ? 'rgba(245,158,11,0.08)'
                                                          : 'rgba(244,63,94,0.08)',
                                                border:     `1px solid ${row.avgDays <= 7 ? 'rgba(16,185,129,0.2)'
                                                           : row.avgDays <= 14 ? 'rgba(245,158,11,0.2)'
                                                           : 'rgba(244,63,94,0.2)'}`,
                                            }}
                                        >
                                            {row.avgDays}d
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ borderTop: '1px solid var(--border-mid)' }}>
                                <td className="px-6 py-3.5 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                    Total
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                    <span
                                        className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-lg text-[11px] font-black"
                                        style={{ background: 'var(--blue-dim)', color: 'var(--blue)', border: '1px solid rgba(59,130,246,0.2)' }}
                                    >
                                        {totals.count}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                    <span className="text-[12px] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>
                                        {fmt(totals.value)}
                                    </span>
                                </td>
                                <NumCell value={totals.calls}    />
                                <NumCell value={totals.emails}   />
                                <NumCell value={totals.meetings} />
                                <NumCell value={totals.notes}    />
                                <td className="px-4 py-3.5 text-center" style={{ color: 'var(--text-muted)' }}>—</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}
