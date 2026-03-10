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
import FocusZone from '@/components/dashboard/FocusZone';
import PerformanceTable from '@/components/dashboard/PerformanceTable';
import ActivitiesTable from '@/components/dashboard/ActivitiesTable';
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
    EyeOff,
    Filter,
    Users,
    Activity as ActivityIcon
} from 'lucide-react';

export default function ManagerDashboard() {
    const token = useAppStore(state => state.token);
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);
    const selectedUserId = useAppStore(state => state.selectedUserId);
    const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
    const viewUsers = useAppStore(state => state.viewUsers);
    const { showPipelineValue, showWinRate, showLeaderboard, defaultModule } = useAppStore(state => state.dashboardSettings);
    const updateSettings = useAppStore(state => state.updateDashboardSettings);
    const startDate = useAppStore(state => state.startDate);
    const endDate = useAppStore(state => state.endDate);

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

    // Date filter logic
    // Date filter logic (Standard range check)
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

    // Filtering & Calculations
    const filteredDeals = useMemo(() => {
        let result = deals;

        // 1. User Filter
        if (selectedUserId !== null) {
            result = result.filter(deal => {
                const uid = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
                return Number(uid) === Number(selectedUserId);
            });
        }

        // 2. Date Filter
        result = result.filter(deal => {
            if (deal.status === 'open') return isDateInRange(deal.add_time, startDate, endDate);
            if (deal.status === 'won') return isDateInRange(deal.won_time, startDate, endDate);
            if (deal.status === 'lost') return isDateInRange(deal.lost_time, startDate, endDate);
            return true;
        });

        return result;
    }, [deals, selectedUserId, startDate, endDate]);

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

    const pipelineVelocity = useMemo(() => {
        // Calculate average days in each stage for open deals
        const stageVelocity = stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
            if (stageDeals.length === 0) return { stageId: stage.id, avgDays: 0 };

            const totalDays = stageDeals.reduce((sum, deal) => {
                const start = new Date(deal.stage_change_time || deal.add_time);
                const diff = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                return sum + diff;
            }, 0);

            return {
                stageId: stage.id,
                avgDays: Math.round(totalDays / stageDeals.length)
            };
        });
        return stageVelocity;
    }, [stages, deals]);

    const funnelData = useMemo(() => {
        return stages.map(stage => {
            const dealsInStage = filteredDeals.filter(d => d.stage_id === stage.id && d.status === 'open');
            const velocity = pipelineVelocity.find(v => v.stageId === stage.id);
            return {
                name: stage.name,
                value: dealsInStage.reduce((sum, d) => sum + (d.value || 0), 0),
                deals: dealsInStage.length,
                avgDays: velocity?.avgDays
            };
        });
    }, [stages, filteredDeals, pipelineVelocity]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    const goalTrackingData = useMemo(() => {
        // Mock targets for demonstration - in a real app these could come from the store or Pipedrive goals API
        const TEAM_GOAL = 500000; // 500k €
        const INDIVIDUAL_GOAL = 100000; // 100k € per person

        const wonDeals = filteredDeals.filter(d => d.status === 'won');
        const openDeals = filteredDeals.filter(d => d.status === 'open');

        let teamCurrent = 0;
        let teamForecast = 0;

        const userStats = new Map();

        // Process Won deals for current progress
        wonDeals.forEach(deal => {
            const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
            const userId = Number(dealUserId);
            const value = deal.value || 0;
            teamCurrent += value;

            if (!userStats.has(userId)) {
                const userName = typeof deal.user_id === 'object' ? deal.user_id?.name : 'Vendedor';
                userStats.set(userId, { id: userId, name: userName, current: 0, forecast: 0, target: INDIVIDUAL_GOAL });
            }
            userStats.get(userId).current += value;
        });

        // Process Open deals for forecasting (value * probability)
        openDeals.forEach(deal => {
            const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
            const userId = Number(dealUserId);
            // Use deal probability or stage probability as fallback
            const probability = (deal.probability || 100) / 100;
            const weightedValue = (deal.value || 0) * probability;

            teamForecast += weightedValue;

            if (!userStats.has(userId)) {
                const userName = typeof deal.user_id === 'object' ? deal.user_id?.name : 'Vendedor';
                userStats.set(userId, { id: userId, name: userName, current: 0, forecast: 0, target: INDIVIDUAL_GOAL });
            }
            userStats.get(userId).forecast += weightedValue;
        });

        // Total forecast is Won + Weighted Open
        teamForecast += teamCurrent;

        // Finalize individual forecast by adding current
        userStats.forEach(stat => {
            stat.forecast += stat.current;
        });

        return {
            teamGoal: TEAM_GOAL,
            teamCurrent,
            teamForecast,
            vendedores: Array.from(userStats.values())
        };
    }, [filteredDeals]);



    const leaderboardData = useMemo(() => {
        const wonDeals = filteredDeals.filter(d => d.status === 'won');
        const usersMap = new Map();

        wonDeals.forEach(deal => {
            const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
            const userId = Number(dealUserId);
            const userName = typeof deal.user_id === 'object' ? deal.user_id?.name : 'Vendedor';

            const current = usersMap.get(userId) || { id: userId, name: userName, value: 0, deals: 0 };
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
                // Add date filter application for activity
                if (!isDateInRange(act.add_time || act.due_date, startDate, endDate)) return;

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
                if (!isDateInRange(note.add_time, startDate, endDate)) return;

                const userId = note.user_id;
                if (!usersMap.has(userId)) return;
                const current = usersMap.get(userId);
                current.breakdown.comments += 1;
                current.totalImpact += 2; // Comments are higher impact engagement
                usersMap.set(userId, current);
            });
        }

        // 3. Process Deal Creations & Movements
        if (allDeals) {
            allDeals.forEach(deal => {
                const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
                const creatorId = Number(dealUserId);

                // Track Creations
                if (isDateInRange(deal.add_time, startDate, endDate) && usersMap.has(creatorId)) {
                    const current = usersMap.get(creatorId);
                    current.breakdown.creations += 1;
                    current.totalImpact += 5; // Creating a lead is high value
                    usersMap.set(creatorId, current);
                }

                // Track Movements
                if (deal.stage_change_time && isDateInRange(deal.stage_change_time, startDate, endDate)) {
                    if (usersMap.has(creatorId)) {
                        const current = usersMap.get(creatorId);
                        current.breakdown.movements += 1;
                        current.totalImpact += 3; // Moving a lead shows progression
                        usersMap.set(creatorId, current);
                    }
                }
            });
        }

        return Array.from(usersMap.values()).filter(u => u.totalImpact > 0 || (selectedUserId === null));
    }, [(activities || []), notes, allDeals, viewUsers, selectedUserId, startDate, endDate]);

    // NEW: Performance and Activities data for the whole team
    const performanceTableData = useMemo(() => {
        if (!viewUsers) return [];
        return viewUsers.map(user => {
            const userDeals = (allDeals || []).filter(d => {
                const dealUserId = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(dealUserId) === Number(user.id);
            });
            const stageCounts: Record<number, number> = {};
            (stages || []).forEach(s => {
                stageCounts[s.id] = userDeals.filter(d => d.stage_id === s.id && d.status === 'open').length;
            });
            const wonValue = userDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + (d.value || 0), 0);

            return {
                id: user.id,
                name: user.name,
                stageCounts,
                totalDeals: userDeals.length,
                totalValue: wonValue
            };
        });
    }, [viewUsers, allDeals, stages]);

    const activitiesTableData = useMemo(() => {
        if (!viewUsers) return [];
        const now = new Date();
        const safeActivities = activities || [];
        return viewUsers.map(user => {
            const userActivities = safeActivities.filter(a => a.user_id === user.id);
            const total = userActivities.length;
            const onTime = userActivities.filter(a => a.done || (a.due_date && new Date(a.due_date) >= now)).length;
            const overdue = userActivities.filter(a => !a.done && a.due_date && new Date(a.due_date) < now).length;
            const pending = userActivities.filter(a => !a.done).length;

            return {
                id: user.id,
                name: user.name,
                total,
                onTime,
                overdue,
                pending
            };
        });
    }, [viewUsers, activities]);

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
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                        <div className="flex items-center gap-2">
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Visual Funnel & WonLost Chart */}
                    <div className="lg:col-span-8 space-y-8">
                        <VisualFunnel data={funnelData} />

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                            <WonLostChart won={metrics.wonCount} lost={metrics.lostCount} lostReasons={lostReasons} />
                        </div>

                        {/* Team Performance and Activities Tables - Integrated here to avoid overlap */}
                        <div className="space-y-8 pt-8">
                            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                <ActivitiesTable members={activitiesTableData} />
                            </div>

                            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                <PerformanceTable
                                    title="Performance de Equipa por Stage"
                                    members={performanceTableData}
                                    stages={stages}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lateral Modules: FocusZone, Activities or Leaderboard */}
                    <div className="lg:col-span-4 space-y-8">
                        <FocusZone
                            deals={allDeals}
                            stages={stages}
                        />

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
