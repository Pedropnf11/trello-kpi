"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelData {
    name: string;
    value: number;
    deals: number;
}

interface VisualFunnelProps {
    data: FunnelData[];
}

export default function VisualFunnel({ data }: VisualFunnelProps) {
    if (!data || data.length === 0) return null;

    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    const useDealsForWidth = totalValue === 0;

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-[#0f1115] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">{item.name}</p>
                    <div className="space-y-1.5">
                        <p className="text-sm font-black text-white flex items-center justify-between gap-4">
                            <span className="text-gray-500 font-bold">Valor:</span>
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.value)}
                        </p>
                        <p className="text-sm font-black text-white flex items-center justify-between gap-4">
                            <span className="text-gray-500 font-bold">Negócios:</span>
                            <span>{item.deals}</span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[450px] w-full bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/20"></div>
                    Funil de Vendas {useDealsForWidth && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded ml-2">Vista por Quantidade</span>}
                </h3>
            </div>

            <div className="h-[80%] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 100, right: 60, top: 0, bottom: 0 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.03} horizontal={false} />
                        <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text
                                            x={-10}
                                            y={0}
                                            dy={4}
                                            textAnchor="end"
                                            fill="#9ca3af"
                                            className="text-[10px] font-black uppercase tracking-tighter"
                                        >
                                            {payload.value}
                                        </text>
                                    </g>
                                );
                            }}
                            width={110}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                        <Bar
                            dataKey={useDealsForWidth ? "deals" : "value"}
                            radius={[0, 12, 12, 0]}
                            barSize={32}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`rgba(59, 130, 246, ${1 - (index * 0.1)})`}
                                    className="filter drop-shadow-lg transition-all duration-300 hover:opacity-80"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Background Ambient Light */}
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
}
