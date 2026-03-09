"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Deal, Stage, Activity, PipedriveUser } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import VisualFunnel from '@/components/dashboard/VisualFunnel';
import Leaderboard from '@/components/dashboard/Leaderboard';
import ActiveSalespeople from '@/components/dashboard/ActiveSalespeople';
import WonLostChart from '@/components/dashboard/WonLostChart';
import {
    TrendingUp,
    Target,
    DollarSign,
    XCircle,
    Loader2,
    Calendar,
    RefreshCw,
    Settings2,
    Eye,
    EyeOff
} from 'lucide-react';

export default function ManagerDashboard() {
    const token = useAppStore(state => state.token);
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);
    const selectedUserId = useAppStore(state => state.selectedUserId);
    const viewUsers = useAppStore(state => state.viewUsers);
    const { showPipelineValue, showWinRate, showLeaderboard, defaultModule } = useAppStore(state => state.dashboardSettings);
    const updateSettings = useAppStore(state => state.updateDashboardSettings);

    const [deals, setDeals] = useState<Deal[]>([]);
    const [allDeals, setAllDeals] = useState<Deal[]>([]);
    const [stages, setStages] = useState<Stage[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchData = async () => {
        if (!token || !selectedPipelineId) return;

        setLoading(true);
        setError(null);
        try {
            const api = new PipedriveAPI(token);
            // Fetch multiple data points for a complete activity overview
            const [dealsData, allDealsData, stagesData, activitiesData, notesData] = await Promise.all([
                api.getDeals(selectedPipelineId),
                api.getAllDeals('open'), // For tracking entries/movements across the account
                api.getStages(selectedPipelineId),
                api.getActivities(),
                api.getNotes()
            ]);

            setDeals(dealsData);
            setAllDeals(allDealsData);
            setStages(stagesData.sort((a, b) => a.order_nr - b.order_nr));
            setActivities(activitiesData);
            setNotes(notesData);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, selectedPipelineId]);

    // Filtering & Calculations
    const filteredDeals = useMemo(() => {
        if (selectedUserId === null) return deals;
        return deals.filter(deal => deal.user_id.id === selectedUserId);
    }, [deals, selectedUserId]);

    const metrics = useMemo(() => {
        const activeDeals = filteredDeals.filter(d => d.status === 'open');
        const wonDeals = filteredDeals.filter(d => d.status === 'won');
        const lostDeals = filteredDeals.filter(d => d.status === 'lost');

        const totalValue = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
        const winRate = (wonDeals.length + lostDeals.length) > 0
            ? Math.round((wonDeals.length / (wonDeals.length + lostDeals.length)) * 100)
            : 0;

        return {
            activeCount: activeDeals.length,
            totalValue,
            wonCount: wonDeals.length,
            lostCount: lostDeals.length,
            winRate
        };
    }, [filteredDeals]);

    const lostReasons = useMemo(() => {
        const reasonsMap = new Map();
        filteredDeals.filter(d => d.status === 'lost').forEach(deal => {
            const reason = deal.lost_reason || 'Outros';
            reasonsMap.set(reason, (reasonsMap.get(reason) || 0) + 1);
        });
        return Array.from(reasonsMap.entries())
            .map(([reason, count]) => ({ reason, count }))
            .sort((a, b) => b.count - a.count);
    }, [filteredDeals]);

    const funnelData = useMemo(() => {
        return stages.map(stage => {
            const dealsInStage = filteredDeals.filter(d => d.stage_id === stage.id && d.status === 'open');
            return {
                name: stage.name,
                value: dealsInStage.reduce((sum, d) => sum + (d.value || 0), 0),
                deals: dealsInStage.length
            };
        });
    }, [stages, filteredDeals]);

    const leaderboardData = useMemo(() => {
        const wonDeals = filteredDeals.filter(d => d.status === 'won');
        const usersMap = new Map();

        wonDeals.forEach(deal => {
            const userId = deal.user_id.id;
            const current = usersMap.get(userId) || { id: userId, name: deal.user_id.name, value: 0, deals: 0 };
            usersMap.set(userId, {
                ...current,
                value: current.value + deal.value,
                deals: current.deals + 1
            });
        });

        return Array.from(usersMap.values()).sort((a, b) => b.deals - a.deals);
    }, [filteredDeals]);

    const activeSalespeopleData = useMemo(() => {
        const usersMap = new Map();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        // Initialize with viewUsers
        viewUsers.forEach(u => {
            usersMap.set(u.id, {
                id: u.id,
                name: u.name,
                totalImpact: 0,
                breakdown: { calls: 0, meetings: 0, emails: 0, creations: 0, movements: 0, comments: 0 }
            });
        });

        // 1. Process Standard Activities
        if (activities) {
            activities.forEach(act => {
                if (!act.done) return;
                const userId = act.user_id;
                if (!usersMap.has(userId)) return;

                const current = usersMap.get(userId);
                const type = act.type.toLowerCase();
                if (type === 'call') current.breakdown.calls += 1;
                else if (type === 'meeting') current.breakdown.meetings += 1;
                else if (type === 'email') current.breakdown.emails += 1;

                current.totalImpact += 1; // 1 point per basic action
                usersMap.set(userId, current);
            });
        }

        // 2. Process Notes (Comments)
        if (notes) {
            notes.forEach(note => {
                const userId = note.user_id;
                if (!usersMap.has(userId)) return;
                const current = usersMap.get(userId);
                current.breakdown.comments += 1;
                current.totalImpact += 2; // Comments are higher impact engagement
                usersMap.set(userId, current);
            });
        }

        // 3. Process Deal Creations & Movements
        // For movements, we check deals where stage_change_time is recent
        if (allDeals) {
            allDeals.forEach(deal => {
                const creatorId = deal.user_id.id; // Usually owner is creator in small teams or recent lists

                // Track Creations (approximate by user ownership if not explicitly returning creator)
                const addDate = new Date(deal.add_time);
                if (addDate >= sevenDaysAgo && usersMap.has(creatorId)) {
                    const current = usersMap.get(creatorId);
                    current.breakdown.creations += 1;
                    current.totalImpact += 5; // Creating a lead is high value
                    usersMap.set(creatorId, current);
                }

                // Track Movements
                if (deal.stage_change_time) {
                    const changeDate = new Date(deal.stage_change_time);
                    if (changeDate >= sevenDaysAgo && usersMap.has(creatorId)) {
                        const current = usersMap.get(creatorId);
                        current.breakdown.movements += 1;
                        current.totalImpact += 3; // Moving a lead shows progression
                        usersMap.set(creatorId, current);
                    }
                }
            });
        }

        return Array.from(usersMap.values()).filter(u => u.totalImpact > 0 || (selectedUserId === null));
    }, [activities, notes, allDeals, viewUsers, selectedUserId]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
                <Header title="Painel de Controlo" />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Sincronizando Insights do CRM...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white overflow-x-hidden">
            <Header title="Manager Insights" />

            <main className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full relative">

                {/* Dashboard Options Panel */}
                {showSettings && (
                    <div className="absolute top-24 right-8 z-50 w-72 bg-[#0f1115]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Personalizar Vista</h4>

                        <div className="space-y-5">
                            <button
                                onClick={() => updateSettings({ showPipelineValue: !showPipelineValue })}
                                className="flex items-center justify-between w-full group"
                            >
                                <span className={`text-xs font-bold transition-colors ${showPipelineValue ? 'text-white' : 'text-gray-500'}`}>Valor em Pipeline</span>
                                {showPipelineValue ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                            </button>

                            <button
                                onClick={() => updateSettings({ showWinRate: !showWinRate })}
                                className="flex items-center justify-between w-full group"
                            >
                                <span className={`text-xs font-bold transition-colors ${showWinRate ? 'text-white' : 'text-gray-500'}`}>Win Rate Global</span>
                                {showWinRate ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                            </button>

                            <button
                                onClick={() => updateSettings({ showLeaderboard: !showLeaderboard })}
                                className="flex items-center justify-between w-full group"
                            >
                                <span className={`text-xs font-bold transition-colors ${showLeaderboard ? 'text-white' : 'text-gray-500'}`}>Ranking Vendas</span>
                                {showLeaderboard ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                            </button>

                            <div className="pt-4 mt-2 border-t border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-4 block">Módulo Lateral Padrão</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => updateSettings({ defaultModule: 'activities' })}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${defaultModule === 'activities' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                    >
                                        ATIVIDADES
                                    </button>
                                    <button
                                        onClick={() => updateSettings({ defaultModule: 'leaderboard' })}
                                        className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${defaultModule === 'leaderboard' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                    >
                                        RANKING
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-8 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest transition-all"
                        >
                            Fechar
                        </button>
                    </div>
                )}

                {/* Dashboard Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Manager Dashboard</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                            <div className="flex items-center gap-2 group cursor-help">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                <span className="text-blue-400 font-black uppercase tracking-widest text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LIVE OPS</span>
                            </div>
                            <span className="text-gray-500 font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-tighter">
                                <Calendar className="w-3 h-3 text-blue-500/50" />
                                {mounted ? new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-lg ${showSettings ? 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-gray-400'}`}
                        >
                            <Settings2 className="w-4 h-4" />
                            Personalizar
                        </button>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Sync
                        </button>
                    </div>
                </div>

                {/* 1. Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Deals Ativos"
                        value={metrics.activeCount}
                        icon={Target}
                        color="blue"
                        trend={{ value: 12, isPositive: true }}
                    />

                    {showPipelineValue && (
                        <MetricCard
                            title="Valor em Pipeline"
                            value={formatCurrency(metrics.totalValue)}
                            icon={DollarSign}
                            color="purple"
                        />
                    )}

                    {showWinRate && (
                        <MetricCard
                            title="Win Rate Global"
                            value={`${metrics.winRate}%`}
                            icon={TrendingUp}
                            color="green"
                        />
                    )}

                    <MetricCard
                        title="Deals Perdidos"
                        value={metrics.lostCount}
                        icon={XCircle}
                        color="red"
                    />
                </div>

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Visual Funnel */}
                    <div className="lg:col-span-8 space-y-8">
                        <VisualFunnel data={funnelData} />

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            <WonLostChart won={metrics.wonCount} lost={metrics.lostCount} lostReasons={lostReasons} />
                        </div>
                    </div>

                    {/* Lateral Modules: Activities or Leaderboard */}
                    <div className="lg:col-span-4 space-y-8">
                        {defaultModule === 'activities' ? (
                            <ActiveSalespeople data={activeSalespeopleData} />
                        ) : (
                            showLeaderboard && <Leaderboard data={leaderboardData} />
                        )}

                        {/* If activities is default, we can still show leaderboard below if selected */}
                        {defaultModule === 'activities' && showLeaderboard && (
                            <Leaderboard data={leaderboardData} />
                        )}

                        {/* Fallback if both hidden and default is leaderboard */}
                        {defaultModule === 'leaderboard' && !showLeaderboard && (
                            <ActiveSalespeople data={activeSalespeopleData} />
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
