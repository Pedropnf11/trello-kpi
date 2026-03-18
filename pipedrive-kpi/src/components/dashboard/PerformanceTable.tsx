"use client";

interface MemberPerformance {
    id: number;
    name: string;
    stageCounts: Record<number, number>;
    totalDeals: number;
    totalValue: number;
}

interface PerformanceTableProps {
    title: string;
    members: MemberPerformance[];
    stages: any[];
}

export default function PerformanceTable({ title, members, stages }: PerformanceTableProps) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-4 rounded-full shrink-0" style={{ background: 'var(--blue)' }} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                    {title}
                </h3>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            <th
                                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: 'var(--text-muted)', minWidth: '180px' }}
                            >
                                Vendedor
                            </th>
                            {stages.map(stage => (
                                <th
                                    key={stage.id}
                                    className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {stage.name}
                                </th>
                            ))}
                            <th
                                className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right"
                                style={{ color: 'var(--blue)' }}
                            >
                                Total €
                            </th>
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
                                    {/* Avatar + nome */}
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

                                    {/* Counts por stage */}
                                    {stages.map(stage => {
                                        const count = member.stageCounts[stage.id] || 0;
                                        return (
                                            <td key={stage.id} className="px-4 py-4 text-center">
                                                {count > 0 ? (
                                                    <span
                                                        className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg text-xs font-black"
                                                        style={{
                                                            background: 'var(--blue-dim)',
                                                            color: 'var(--blue)',
                                                            border: '1px solid rgba(59,130,246,0.2)',
                                                        }}
                                                    >
                                                        {count}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                                                )}
                                            </td>
                                        );
                                    })}

                                    {/* Total € */}
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>
                                            {fmt(member.totalValue)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={stages.length + 2}
                                    className="px-6 py-12 text-center text-[11px] font-bold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    Nenhum dado encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
