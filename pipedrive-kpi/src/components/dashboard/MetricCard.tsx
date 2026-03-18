import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; isPositive: boolean };
    color: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'violet';
    valueSecondary?: string;
}

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, color, valueSecondary }: MetricCardProps) {
    // Paleta premium: só azul para positivo, rose para alerta, cinzento para neutro
    const isAlert  = color === 'red' || color === 'orange';
    const isAccent = color === 'blue' || color === 'purple' || color === 'violet';

    const cardClass = isAlert
        ? 'border-rose-500/15 shadow-rose-500/5'
        : isAccent
            ? 'border-blue-500/15 shadow-blue-500/5'
            : 'border-white/[0.06] shadow-black/20';

    const accentText  = isAlert ? 'text-rose-400'  : isAccent ? 'text-blue-400'  : 'text-gray-400';
    const accentBg    = isAlert ? 'bg-rose-500/8'   : isAccent ? 'bg-blue-500/8'   : 'bg-white/[0.04]';
    const glowClass   = isAlert ? 'bg-rose-500'     : isAccent ? 'bg-blue-500'     : 'bg-white';

    return (
        <div className={`relative overflow-hidden rounded-2xl border bg-[#0f1115]/90 p-6 transition-all duration-300 hover:scale-[1.015] hover:shadow-xl shadow-lg ${cardClass}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 mb-2">{title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight leading-none">{value}</h3>
                    {valueSecondary && (
                        <p className={`mt-1.5 text-sm font-bold ${accentText}`}>{valueSecondary}</p>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-[11px] text-gray-600 font-medium">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-xl p-3 shrink-0 ml-3 ${accentBg}`}>
                    <Icon className={`h-5 w-5 ${accentText}`} />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        trend.isPositive
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                        {trend.isPositive ? '+' : '-'}{trend.value}%
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">vs mês anterior</span>
                </div>
            )}

            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full ${glowClass} opacity-[0.03] blur-2xl pointer-events-none`}></div>
        </div>
    );
}
