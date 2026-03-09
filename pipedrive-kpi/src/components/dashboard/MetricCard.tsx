import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'red' | 'orange' | 'purple';
}

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, color }: MetricCardProps) {
    const colorClasses = {
        blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20 shadow-blue-500/10',
        green: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20 shadow-green-500/10',
        red: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/20 shadow-red-500/10',
        orange: 'from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20 shadow-orange-500/10',
        purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20 shadow-purple-500/10',
    };

    const iconBgClasses = {
        blue: 'bg-blue-500/10 text-blue-400',
        green: 'bg-green-500/10 text-green-400',
        red: 'bg-red-500/10 text-red-400',
        orange: 'bg-orange-500/10 text-orange-400',
        purple: 'bg-purple-500/10 text-purple-400',
    };

    return (
        <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colorClasses[color]}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                    {subtitle && <p className="mt-1 text-sm text-gray-400 font-medium">{subtitle}</p>}
                </div>
                <div className={`rounded-xl p-3 ${iconBgClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {trend.isPositive ? '+' : '-'}{trend.value}%
                    </span>
                    <span className="text-xs text-gray-500 font-medium italic">vs mês anterior</span>
                </div>
            )}

            {/* Ambient Background Light */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-current opacity-5 blur-3xl"></div>
        </div>
    );
}
