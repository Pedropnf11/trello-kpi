"use client";

import { Activity, User, MousePointer2, PlusSquare, MessageSquare, TrendingUp, Phone, CalendarDays, Mail } from 'lucide-react';

interface ActiveSalesperson {
    id: number;
    name: string;
    totalImpact: number;
    breakdown: {
        calls: number;
        meetings: number;
        emails: number;
        creations: number;
        movements: number;
        comments: number;
    };
}

interface ActiveSalespeopleProps {
    data: ActiveSalesperson[];
}

export default function ActiveSalespeople({ data }: ActiveSalespeopleProps) {
    const sortedData = [...data].sort((a, b) => b.totalImpact - a.totalImpact);

    return (
        <div className="bg-[#0f1115]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden h-full flex flex-col group/container">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover/container:bg-blue-600/15 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-10 relative z-10 px-2">
                <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-blue-500/80 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-8 h-px bg-blue-500/30"></span>
                        Performance Ativa
                    </h3>
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none">Ranking de Atividade</h2>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        Impacto Total
                    </span>
                </div>
            </div>

            <div className="space-y-6 relative z-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
                {sortedData.length > 0 ? (
                    sortedData.map((vendedor, index) => (
                        <div
                            key={vendedor.id}
                            className="p-1 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent hover:from-blue-500/20 transition-all duration-500 group/item"
                        >
                            <div className="bg-[#14171c]/90 backdrop-blur-md p-6 rounded-[1.9rem] border border-white/5 group-hover/item:border-blue-500/20 transition-all duration-300 relative overflow-hidden">
                                {/* Rank Badge */}
                                <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/10 rounded-br-[2rem] flex items-center justify-center border-r border-b border-white/5 group-hover/item:bg-blue-500/20 transition-colors">
                                    <span className="text-2xl font-black text-blue-400/50 group-hover/item:text-blue-400 transition-colors">#{index + 1}</span>
                                </div>

                                <div className="flex items-center justify-between mb-8 pl-12">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a1d24] to-[#0f1115] p-0.5 shadow-2xl">
                                                <div className="w-full h-full rounded-2xl bg-[#14171c] flex items-center justify-center text-xl font-black text-white border border-white/5">
                                                    {vendedor.name.charAt(0)}
                                                </div>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black px-3 py-1 rounded-full text-[9px] font-black tracking-widest shadow-[0_0_20px_rgba(251,191,36,0.4)] uppercase">
                                                    MVP
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white tracking-tight group-hover/item:text-blue-100 transition-colors">
                                                {vendedor.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ativo no Pipedrive</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-400 tracking-tighter">
                                            {vendedor.totalImpact}
                                        </p>
                                        <p className="text-[9px] text-blue-500/50 font-black uppercase tracking-widest mt-1">Pontos KPI</p>
                                    </div>
                                </div>

                                {/* Modernized Breakdown Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: 'Entradas', value: vendedor.breakdown.creations, color: 'text-emerald-400', icon: PlusSquare },
                                        { label: 'Movimentos', value: vendedor.breakdown.movements, color: 'text-blue-400', icon: MousePointer2 },
                                        { label: 'Notas', value: vendedor.breakdown.comments, color: 'text-purple-400', icon: MessageSquare }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 group-hover/item:bg-white/[0.04] transition-all">
                                            <div className="flex items-center gap-2 mb-3">
                                                <item.icon className={`w-3 h-3 ${item.color}`} />
                                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <p className="text-xl font-black text-white">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Activity Bar */}
                                <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2 group/act">
                                            <Phone className="w-3.5 h-3.5 text-pink-500/50 group-hover/act:text-pink-400 transition-colors" />
                                            <span className="text-xs font-black text-gray-400">{vendedor.breakdown.calls}</span>
                                        </div>
                                        <div className="flex items-center gap-2 group/act">
                                            <CalendarDays className="w-3.5 h-3.5 text-amber-500/50 group-hover/act:text-amber-400 transition-colors" />
                                            <span className="text-xs font-black text-gray-400">{vendedor.breakdown.meetings}</span>
                                        </div>
                                        <div className="flex items-center gap-2 group/act">
                                            <Mail className="w-3.5 h-3.5 text-indigo-500/50 group-hover/act:text-indigo-400 transition-colors" />
                                            <span className="text-xs font-black text-gray-400">{vendedor.breakdown.emails}</span>
                                        </div>
                                    </div>
                                    <div className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Ações Diretas</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                            <User className="w-10 h-10 text-gray-700" />
                        </div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest bg-white/5 px-6 py-2 rounded-full border border-white/5">Aguardando Atividade...</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </div>
    );
}
