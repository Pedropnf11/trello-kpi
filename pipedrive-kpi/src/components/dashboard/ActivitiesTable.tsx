"use client";

import { Calendar, Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

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
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-4 rounded-full bg-violet-500"></span>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.12em]">Atividades & Follow-ups</h3>
                </div>
                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hidden md:block">
                    Cumprimento de datas e prazos
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest min-w-[200px]">
                                Vendedor
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Calendar className="w-3 h-3" />
                                    Agendados
                                </div>
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    A Tempo
                                </div>
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <AlertCircle className="w-3 h-3" />
                                    Atrasados
                                </div>
                            </th>
                            <th className="px-4 py-4 text-[10px] font-black text-amber-500 uppercase tracking-widest text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    Pendentes
                                </div>
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
                                    <td className="px-4 py-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg bg-white/[0.03] text-gray-400 text-xs font-black border border-white/[0.06]">
                                            {member.total}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {member.onTime > 0 ? (
                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/20">
                                                {member.onTime}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700 font-medium">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {member.overdue > 0 ? (
                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/20">
                                                {member.overdue}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700 font-medium">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {member.pending > 0 ? (
                                            <span className="inline-flex items-center justify-center min-w-[2.25rem] h-6 px-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-black border border-amber-500/20">
                                                {member.pending}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700 font-medium">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
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
