"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface WonLostData {
    name: string;
    value: number;
    color: string;
}

interface LostReason {
    reason: string;
    count: number;
}

interface WonLostChartProps {
    won: number;
    lost: number;
    lostReasons?: LostReason[];
}

export default function WonLostChart({ won, lost, lostReasons = [] }: WonLostChartProps) {
    const data: WonLostData[] = [
        { name: 'Ganhos (Won)', value: won, color: '#22c55e' },
        { name: 'Perdidos (Lost)', value: lost, color: '#ef4444' },
    ];

    const total = won + lost;
    const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0f1115] border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{payload[0].name}</p>
                    <p className="text-lg font-black" style={{ color: payload[0].payload.color }}>
                        {payload[0].value} Negócios
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 font-bold">
                        {((payload[0].value / total) * 100).toFixed(1)}% do total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm h-full flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Análise Won / Lost
            </h3>

            <div className="flex-1 min-h-[220px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            formatter={(value) => <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none -mt-4">
                    <p className="text-2xl font-black text-white leading-none">{winRate}%</p>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">Win Rate</p>
                </div>
            </div>

            {/* Lost Reasons Section */}
            {lostReasons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Principais Motivos de Perda</p>
                    <div className="space-y-2">
                        {lostReasons.slice(0, 3).map((lr, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-xs text-gray-400 truncate pr-2 group-hover:text-white transition-colors">{lr.reason || 'Sem motivo especificado'}</span>
                                <span className="text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded italic">{lr.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-auto pt-6 grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-xl font-black text-green-400 border-t border-green-500/10 pt-2">{won}</p>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">Ganhos</p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-red-400 border-t border-red-500/10 pt-2">{lost}</p>
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">Perdidos</p>
                </div>
            </div>
        </div>
    );
}
