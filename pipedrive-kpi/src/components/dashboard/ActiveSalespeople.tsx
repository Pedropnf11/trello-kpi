"use client";

import { Activity, User, MousePointer2, PlusSquare, MessageSquare, TrendingUp } from 'lucide-react';

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
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm h-full group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-1.5 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/20"></div>
                        Vendedores Mais Ativos
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold ml-4.5 italic">Ações, Entradas e Movimentos</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <span className="text-[10px] font-black text-blue-400 uppercase">Impacto CRM</span>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {sortedData.length > 0 ? (
                    sortedData.map((vendedor, index) => (
                        <div
                            key={vendedor.id}
                            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300 group/item"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover/item:bg-blue-500 group-hover/item:text-white group-hover/item:scale-110 transition-all duration-300`}>
                                            {index + 1}
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-lg text-[8px] font-black animate-bounce">TOP</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-white group-hover/item:text-blue-400 transition-colors">
                                            {vendedor.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded">
                                                {vendedor.totalImpact} Pontos de Impacto
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 text-blue-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-2xl font-black">{vendedor.totalImpact}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Breakdown Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5 group-hover/item:border-blue-500/20 transition-colors">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <PlusSquare className="w-3 h-3 text-emerald-400" />
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Entradas</p>
                                    </div>
                                    <p className="text-xs font-black text-white">{vendedor.breakdown.creations}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5 group-hover/item:border-blue-500/20 transition-colors">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <MousePointer2 className="w-3 h-3 text-blue-400" />
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Movimentos</p>
                                    </div>
                                    <p className="text-xs font-black text-white">{vendedor.breakdown.movements}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5 group-hover/item:border-blue-500/20 transition-colors">
                                    <div className="flex items-center justify-center gap-1.5 mb-1">
                                        <MessageSquare className="w-3 h-3 text-purple-400" />
                                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">Notas</p>
                                    </div>
                                    <p className="text-xs font-black text-white">{vendedor.breakdown.comments}</p>
                                </div>
                            </div>

                            {/* Standard Activities */}
                            <div className="flex items-center justify-between text-[10px] px-2 py-1 bg-white/5 rounded-lg border border-white/5 group-hover/item:bg-blue-500/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[8px]">Ações:</span>
                                    <span className="text-white font-black">📞 {vendedor.breakdown.calls}</span>
                                    <span className="text-white font-black">🤝 {vendedor.breakdown.meetings}</span>
                                    <span className="text-white font-black">📧 {vendedor.breakdown.emails}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <User className="w-12 h-12 text-gray-700 mb-4" />
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest italic">A aguardar atividades...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
