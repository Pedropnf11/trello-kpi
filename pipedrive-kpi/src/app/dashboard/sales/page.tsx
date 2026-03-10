"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Deal, Stage, Activity } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import VisualFunnel from '@/components/dashboard/VisualFunnel';
import FocusZone from '@/components/dashboard/FocusZone';
import PerformanceTable from '@/components/dashboard/PerformanceTable';
import ActivitiesTable from '@/components/dashboard/ActivitiesTable';
import {
    LayoutDashboard,
    TrendingUp,
    XCircle,
    DollarSign,
    Loader2
} from 'lucide-react';

export default function SalesDashboard() {
    const token = useAppStore(state => state.token);
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);
    const currentUserId = useAppStore(state => state.userId);
    const currentUserName = useAppStore(state => state.userName);

    const [deals, setDeals] = useState<Deal[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!token || !selectedPipelineId) return;

        setLoading(true);
        setError(null);
        try {
            const api = new PipedriveAPI(token);
            // In sales dashboard, we only care about current user's activities
            const [dealsData, stagesData, activitiesData] = await Promise.all([
                api.getDeals(selectedPipelineId),
                api.getStages(selectedPipelineId),
                api.getActivities(currentUserId || undefined)
            ]);

            setDeals(dealsData);
            setStages(stagesData.sort((a, b) => a.order_nr - b.order_nr));
            setActivities(activitiesData);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, selectedPipelineId, currentUserId]);

    // 1. Filter data for the current user
    const userDeals = useMemo(() => {
        return deals.filter((d: any) => {
            const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
            return Number(uid) === Number(currentUserId);
        });
    }, [deals, currentUserId]);

    // 2. Calculate Metrics
    const metrics = useMemo(() => {
        const won = userDeals.filter((d: Deal) => d.status === 'won');
        const lost = userDeals.filter((d: Deal) => d.status === 'lost');
        const open = userDeals.filter((d: Deal) => d.status === 'open');

        const wonValue = won.reduce((sum: number, d: Deal) => sum + (d.value || 0), 0);
        const openValue = open.reduce((sum: number, d: Deal) => sum + (d.value || 0), 0);

        const total = won.length + lost.length;
        const winRate = total > 0 ? Math.round((won.length / total) * 100) : 0;

        return {
            wonCount: won.length,
            wonValue,
            lostCount: lost.length,
            openCount: open.length,
            openValue,
            winRate
        };
    }, [userDeals]);

    // 3. Funnel Data
    const funnelData = useMemo(() => {
        return stages.map((stage: Stage) => {
            const dealsInStage = userDeals.filter((d: Deal) => d.stage_id === stage.id && d.status === 'open');
            return {
                name: stage.name,
                value: dealsInStage.reduce((sum: number, d: Deal) => sum + (d.value || 0), 0),
                deals: dealsInStage.length
            };
        });
    }, [stages, userDeals]);

    // 4. Performance Data for Tables
    const performanceData = useMemo(() => {
        const stageCounts: Record<number, number> = {};
        stages.forEach((s: Stage) => {
            stageCounts[s.id] = userDeals.filter((d: Deal) => d.stage_id === s.id && d.status === 'open').length;
        });

        return [{
            id: currentUserId || 0,
            name: currentUserName || 'Eu',
            stageCounts,
            totalDeals: userDeals.length,
            totalValue: metrics.wonValue
        }];
    }, [stages, userDeals, currentUserId, currentUserName, metrics.wonValue]);

    // 5. Activities Data
    const activitiesData = useMemo(() => {
        const now = new Date();
        const total = activities.length;
        const onTime = activities.filter((a: Activity) => a.done || (a.due_date && new Date(a.due_date) >= now)).length;
        const overdue = activities.filter((a: Activity) => !a.done && a.due_date && new Date(a.due_date) < now).length;
        const pending = activities.filter((a: Activity) => !a.done).length;

        return [{
            id: currentUserId || 0,
            name: currentUserName || 'Eu',
            total,
            onTime,
            overdue,
            pending
        }];
    }, [activities, currentUserId, currentUserName]);



    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
                <Header title="A carregar..." />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
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
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
            <Header title="O Meu Dashboard" />

            <div className="p-8 flex-1">
                <div className="max-w-[1600px] mx-auto space-y-8">

                    {/* 1. Header & Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            title="Vendas Ganhas"
                            value={formatCurrency(metrics.wonValue)}
                            subtitle={`${metrics.wonCount} Negócios`}
                            icon={DollarSign}
                            color="blue"
                        />
                        <MetricCard
                            title="Win Rate"
                            value={`${metrics.winRate}%`}
                            icon={TrendingUp}
                            color="green"
                        />
                        <MetricCard
                            title="Em Negociação"
                            value={formatCurrency(metrics.openValue)}
                            subtitle={`${metrics.openCount} Leads Ativas`}
                            icon={LayoutDashboard}
                            color="violet"
                        />
                        <MetricCard
                            title="Perdidos"
                            value={metrics.lostCount}
                            icon={XCircle}
                            color="red"
                        />
                    </div>

                    {/* 2. Main Content Grid */}
                    {/* 2. Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* LEFT: Funnel & Tables */}
                        <div className="lg:col-span-8 space-y-8">
                            <VisualFunnel data={funnelData} />

                            <div className="space-y-8 pt-8">
                                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                    <ActivitiesTable members={activitiesData} />
                                </div>

                                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                    <PerformanceTable
                                        title="A Minha Performance por Stage"
                                        members={performanceData}
                                        stages={stages}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Focus Zone */}
                        <div className="lg:col-span-4 flex flex-col">
                            <FocusZone
                                deals={deals}
                                stages={stages}
                                memberId={currentUserId || undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
