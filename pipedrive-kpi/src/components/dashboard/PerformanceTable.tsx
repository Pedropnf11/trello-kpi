"use client";

import { User } from 'lucide-react';

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
    accentColor?: 'blue' | 'gray' | 'violet';
}

export default function PerformanceTable({ title, members, stages, accentColor = 'blue' }: PerformanceTableProps) {
    const accentStyles = {
        blue: 'bg-blue-500',
        gray: 'bg-gray-500',
        violet: 'bg-violet-500',
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-4 rounded-full ${accentStyles[accentColor]}`}></span>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">{title}</h3>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[200px]">
                                Vendedor
                            </th>
                            {stages.map((stage) => (
                                <th key={stage.id} className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center whitespace-nowrap">
                                    {stage.name}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-[10px] font-black text-blue-400 uppercase tracking-widest text-right">
                                TOTAL €
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {members.length > 0 ? (
                            members.map((member) => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors truncate">
                                                {member.name}
                                            </span>
                                        </div>
                                    </td>
                                    {stages.map((stage) => {
                                        const count = member.stageCounts[stage.id] || 0;
                                        return (
                                            <td key={stage.id} className="px-4 py-4 text-center">
                                                {count > 0 ? (
                                                    <span className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-black border border-blue-500/20">
                                                        {count}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-700 font-medium">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-black text-white tabular-nums">
                                            {formatCurrency(member.totalValue)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={stages.length + 2} className="px-6 py-12 text-center">
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Nenhum dado encontrado</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
