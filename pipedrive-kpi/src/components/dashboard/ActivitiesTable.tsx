"use client";

import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface MemberActivities {
    id: number;
    name: string;
    total: number;
    onTime: number;
    overdue: number;
    pending: number;
}

interface ActivitiesTableProps {
    members: MemberActivities[];
}

export default function ActivitiesTable({ members }: ActivitiesTableProps) {

    const ColHeader = ({
        label, icon: Icon, color,
    }: {
        label: string; icon: React.ElementType; color: string;
    }) => (
        <th className="px-4 py-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color }}>
                <Icon className="w-3 h-3 shrink-0" />
                {label}
            </div>
        </th>
    );

    const Badge = ({ value, bg, color, border }: { value: number; bg: string; color: string; border: string }) =>
        value > 0 ? (
            <span
                className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg text-xs font-black"
                style={{ background: bg, color, border: `1px solid ${border}` }}
            >
                {value}
            </span>
        ) : (
            <span style={{ color: 'var(--text-muted)' }}>—</span>
        );

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-4 rounded-full shrink-0" style={{ background: 'var(--violet)' }} />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                        Atividades & Follow-ups
                    </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block" style={{ color: 'var(--text-muted)' }}>
                    Cumprimento de datas e prazos
                </span>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)', minWidth: '180px' }}>
                                Vendedor
                            </th>
                            <ColHeader label="Agendados" icon={Calendar}      color="var(--text-secondary)" />
                            <ColHeader label="A Tempo"   icon={CheckCircle2}  color="var(--green)"  />
                            <ColHeader label="Atrasados" icon={AlertCircle}   color="var(--rose)"   />
                            <ColHeader label="Pendentes" icon={Clock}         color="var(--orange)" />
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member, idx) => (
                                <tr
                                    key={member.id}
                                    style={{ borderBottom: idx < members.length - 1 ? '1px solid var(--border)' : 'none' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                                            >
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                                {member.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Agendados — neutro */}
                                    <td className="px-4 py-4 text-center">
                                        <Badge
                                            value={member.total}
                                            bg="var(--bg-surface)"
                                            color="var(--text-secondary)"
                                            border="var(--border)"
                                        />
                                    </td>

                                    {/* A tempo — verde */}
                                    <td className="px-4 py-4 text-center">
                                        <Badge
                                            value={member.onTime}
                                            bg="rgba(16,185,129,0.08)"
                                            color="var(--green)"
                                            border="rgba(16,185,129,0.2)"
                                        />
                                    </td>

                                    {/* Atrasados — rose */}
                                    <td className="px-4 py-4 text-center">
                                        <Badge
                                            value={member.overdue}
                                            bg="rgba(244,63,94,0.08)"
                                            color="var(--rose)"
                                            border="rgba(244,63,94,0.2)"
                                        />
                                    </td>

                                    {/* Pendentes — amber */}
                                    <td className="px-4 py-4 text-center">
                                        <Badge
                                            value={member.pending}
                                            bg="rgba(245,158,11,0.08)"
                                            color="var(--orange)"
                                            border="rgba(245,158,11,0.2)"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[11px] font-bold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted)' }}>
                                    Sem dados de follow-up para este período
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
