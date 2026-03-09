"use client";

import { Trophy, ArrowUpRight } from 'lucide-react';

interface LeaderboardItem {
    id: number;
    name: string;
    value: number;
    deals: number;
}

interface LeaderboardProps {
    data: LeaderboardItem[];
}

export default function Leaderboard({ data }: LeaderboardProps) {
    // Sort by value desc
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    Ranking de Vendedores
                </h3>
            </div>

            <div className="space-y-4">
                {sortedData.length > 0 ? (
                    sortedData.map((vendedor, index) => (
                        <div
                            key={vendedor.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                                        index === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/20' :
                                            index === 2 ? 'bg-orange-800/20 text-orange-800 border border-orange-800/20' :
                                                'bg-white/5 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {vendedor.name}
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">
                                        {vendedor.deals} Negócios Ganhos
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white whitespace-nowrap">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(vendedor.value)}
                                </p>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-green-400 font-bold">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span>Top {index + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-sm font-medium italic">Nenhum dado de vendas disponível.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
