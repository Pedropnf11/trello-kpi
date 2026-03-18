"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Deal, Stage } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import {
    Loader2,
    XCircle,
    TrendingUp,
    PieChart
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart as RechartsPieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function SalesCharts() {
    const token = useAppStore(state => state.token);
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);
    const currentUserId = useAppStore(state => state.userId);
    const startDate = useAppStore(state => state.startDate);
    const endDate = useAppStore(state => state.endDate);

    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!token || !selectedPipelineId) return;

        setLoading(true);
        setError(null);
        try {
            const api = new PipedriveAPI(token);
            const dealsData = await api.getDeals(selectedPipelineId);
            setDeals(dealsData);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, selectedPipelineId]);

    // Date filter logic
    const isDateInRange = (dateStr: string | null, start: string | null, end: string | null) => {
        if (!dateStr) return false;
        if (!start && !end) return true;

        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);

        if (start) {
            const startDate = new Date(start);
            startDate.setHours(0, 0, 0, 0);
            if (date < startDate) return false;
        }

        if (end) {
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
            if (date > endDate) return false;
        }

        return true;
    };

    const userDeals = useMemo(() => {
        let filtered = deals.filter((d: any) => {
            const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
            return Number(uid) === Number(currentUserId);
        });

        filtered = filtered.filter(deal => {
            if (deal.status === 'open') return isDateInRange(deal.add_time, startDate, endDate);
            if (deal.status === 'won') return isDateInRange(deal.won_time, startDate, endDate);
            if (deal.status === 'lost') return isDateInRange(deal.lost_time, startDate, endDate);
            return true;
        });

        return filtered;
    }, [deals, currentUserId, startDate, endDate]);

    // 1. Evolução de Vendas ao longo do tempo (Won Deals Value per Month/Day)
    const salesOverTimeData = useMemo(() => {
        const wonDeals = userDeals.filter(d => d.status === 'won' && d.won_time);

        // Group by YYYY-MM if long period, else by YYYY-MM-DD
        const isLongPeriod = !startDate || !endDate ? true : (new Date(endDate).getTime() - new Date(startDate).getTime()) > 1000 * 60 * 60 * 24 * 60; // > 60 days

        const timeMap = new Map();

        wonDeals.forEach(deal => {
            const dateObj = new Date(deal.won_time as string);
            let timeKey = '';

            if (isLongPeriod) {
                // Format as "Mon YYYY" (e.g., "Jan 2024")
                timeKey = dateObj.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
            } else {
                // Format as "DD/MM"
                timeKey = dateObj.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
            }

            const current = timeMap.get(timeKey) || { time: timeKey, value: 0 };
            timeMap.set(timeKey, { ...current, value: current.value + (deal.value || 0) });
        });

        return Array.from(timeMap.values());
    }, [userDeals, startDate, endDate]);

    // 2. Distribuição de Perdas Pessoal (Pie Chart)
    const lostReasonsData = useMemo(() => {
        const reasonsMap = new Map();

        userDeals.filter(d => d.status === 'lost').forEach(deal => {
            const reason = deal.lost_reason || 'Outros / Sem Motivo';
            reasonsMap.set(reason, (reasonsMap.get(reason) || 0) + 1);
        });

        return Array.from(reasonsMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [userDeals]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
                <Header title="Os Meus Gráficos" />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse">A carregar gráficos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
                <Header title="Erro" />
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-center max-w-md">
                        <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Ops! Algo correu mal</h2>
                        <p className="text-gray-400 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => fetchData()}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white overflow-x-hidden">
            <Header title="A Minha Análise Gráfica" />

            <main className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Evolução de Vendas */}
                    <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                A Minha Evolução de Vendas Ganhas
                            </h2>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                Valor em Euro ao longo do tempo selecionado
                            </p>
                        </div>

                        <div className="h-80 w-full relative">
                            {salesOverTimeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesOverTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2e37" vertical={false} />
                                        <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickMargin={10} minTickGap={15} />
                                        <YAxis
                                            stroke="#71717a"
                                            fontSize={11}
                                            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                                            width={60}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f1115', borderColor: '#1f2937', borderRadius: '12px', color: '#fff' }}
                                            formatter={(value: number) => [new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value), 'Valor']}
                                            labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f1115' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-500 border border-dashed border-white/10 rounded-2xl">
                                    Não há ganhos no período selecionado.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Distribuição de Perdas */}
                    <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
                        <div className="flex flex-col gap-1 mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-rose-500" />
                                As Minhas Perdas (Lost Reasons)
                            </h2>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                Porquê que estou a perder negócios?
                            </p>
                        </div>

                        <div className="h-80 w-full relative flex items-center justify-center">
                            {lostReasonsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={lostReasonsData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                                                if (percent < 0.05) return null;

                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} className="font-bold drop-shadow-md">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}
                                            outerRadius={120}
                                            innerRadius={60}
                                            paddingAngle={2}
                                            stroke="none"
                                            dataKey="value"
                                        >
                                            {lostReasonsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f1115', borderColor: '#1f2937', borderRadius: '12px', color: '#fff', border: '1px solid #1f2937' }}
                                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                            formatter={(value: number) => [value, 'Deals Perdidos']}
                                        />
                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                            wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-500 border border-dashed border-white/10 rounded-2xl">
                                    Sem negócios perdidos no período.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
