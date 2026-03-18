"use client";

import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface GoalData {
    id: number;
    name: string;
    target: number;
    current: number;
    forecast: number;
}

interface GoalTrackerProps {
    vendedores: GoalData[];
}

export default function GoalTracker({ vendedores }: GoalTrackerProps) {
    // Scorecard color logic
    const getScoreColor = (percent: number) => {
        if (percent >= 90) return 'text-green-400 bg-green-400/10 border-green-400/20';
        if (percent >= 50) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    Objetivos de Vendas
                </h3>
            </div>

            {/* Individual Scorecards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendedores.map((v) => {
                    const progress = v.target > 0 ? Math.min(Math.round((v.current / v.target) * 100), 100) : 0;
                    const forecast = v.target > 0 ? Math.min(Math.round((v.forecast / v.target) * 100), 100) : 0;

                    return (
                        <div key={v.id} className="bg-[#0f172a] rounded-2xl p-5 border border-white/[0.04] hover:border-white/[0.08] transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] -mr-12 -mt-12 rounded-full opacity-10 ${progress >= 90 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-rose-500'}`} />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{v.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium">Meta: {formatCurrency(v.target)}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-lg border text-[10px] font-black ${getScoreColor(progress)}`}>
                                    {progress}%
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>Status</span>
                                        <span className="text-white">{formatCurrency(v.current)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={`h-full transition-all duration-1000 ${progress >= 90 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-rose-500'}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="w-3 h-3 text-blue-400" />
                                        <span className="text-[9px] font-bold text-gray-500 uppercase">Previsão</span>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-400">{formatCurrency(v.forecast)} ({forecast}%)</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
