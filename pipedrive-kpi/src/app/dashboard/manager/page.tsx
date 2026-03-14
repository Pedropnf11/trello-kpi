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
import HeatmapChart from '@/components/dashboard/HeatmapChart';
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
    Activity as ActivityIcon,
    Download,
    FileText,
    FileSpreadsheet
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
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const fetchData = async () => {
        if (!token || !selectedPipelineId) return;
        setLoading(true); setError(null);
        try {
            const api = new PipedriveAPI(token);
            const [dealsData, allDealsData, stagesData, activitiesData, notesData] = await Promise.all([
                api.getDeals(selectedPipelineId),
                api.getAllDeals('open'),
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

    const handleExportPDF = async () => {
        setShowExportMenu(false);
        const element = document.getElementById('dashboard-content');
        if (!element) return;
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 0.5,
                filename: `Relatorio-Manager-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#05070a' },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' as const }
            };
            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Failed to generate PDF", error);
        }
    };

    const handleExportCSV = () => {
        setShowExportMenu(false);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Métrica,Valor\n";
        csvContent += `Deals Ativos,${metrics.activeCount}\n`;
        csvContent += `Valor em Pipeline,${metrics.totalValue}\n`;
        csvContent += `Win Rate,${metrics.winRate}%\n`;
        csvContent += `Deals Perdidos,${metrics.lostCount}\n\n`;
        csvContent += "ID,Negócio,Valor,Status,Adicionado em\n";
        filteredDeals.forEach(d => {
            csvContent += `${d.id},"${d.title}",${d.value || 0},${d.status},${d.add_time || ''}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Export-Manager-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => { fetchData(); }, [token, selectedPipelineId]);

    const isDateInRange = (dateStr: string | null, start: string | null, end: string | null) => {
        if (!dateStr) return false;
        if (!start && !end) return true;
        const date = new Date(dateStr); date.setHours(0, 0, 0, 0);
        if (start) { const s = new Date(start); s.setHours(0, 0, 0, 0); if (date < s) return false; }
        if (end) { const e = new Date(end); e.setHours(23, 59, 59, 999); if (date > e) return false; }
        return true;
    };

    const filteredDeals = useMemo(() => {
        let result = deals;
        if (selectedUserId !== null) {
            result = result.filter(deal => {
                const uid = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
                return Number(uid) === Number(selectedUserId);
            });
        }
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
        return { activeCount: activeDeals.length, totalValue, wonCount: wonDeals.length, lostCount: lostDeals.length, winRate };
    }, [filteredDeals]);

    const lostReasons = useMemo(() => {
        const reasonsMap = new Map();
        filteredDeals.filter(d => d.status === 'lost').forEach(deal => {
            const reason = deal.lost_reason || 'Outros';
            reasonsMap.set(reason, (reasonsMap.get(reason) || 0) + 1);
        });
        return Array.from(reasonsMap.entries()).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
    }, [filteredDeals]);

    const pipelineVelocity = useMemo(() => stages.map(stage => {
        const stageDeals = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
        if (stageDeals.length === 0) return { stageId: stage.id, avgDays: 0 };
        const totalDays = stageDeals.reduce((sum, deal) => {
            return sum + Math.floor((new Date().getTime() - new Date(deal.stage_change_time || deal.add_time).getTime()) / 86400000);
        }, 0);
        return { stageId: stage.id, avgDays: Math.round(totalDays / stageDeals.length) };
    }), [stages, deals]);

    const funnelData = useMemo(() => stages.map(stage => {
        const dealsInStage = filteredDeals.filter(d => d.stage_id === stage.id && d.status === 'open');
        const velocity = pipelineVelocity.find(v => v.stageId === stage.id);
        return {
            name: stage.name,
            value: dealsInStage.reduce((sum, d) => sum + (d.value || 0), 0),
            deals: dealsInStage.length,
            avgDays: velocity?.avgDays
        };
    }), [stages, filteredDeals, pipelineVelocity]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    const leaderboardData = useMemo(() => {
        const wonDeals = filteredDeals.filter(d => d.status === 'won');
        const usersMap = new Map();
        wonDeals.forEach(deal => {
            const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
            const userId = Number(dealUserId);
            const userName = typeof deal.user_id === 'object' ? deal.user_id?.name : 'Vendedor';
            const current = usersMap.get(userId) || { id: userId, name: userName, value: 0, deals: 0 };
            usersMap.set(userId, { ...current, value: current.value + deal.value, deals: current.deals + 1 });
        });
        return Array.from(usersMap.values()).sort((a, b) => b.deals - a.deals);
    }, [filteredDeals]);

    const activeSalespeopleData = useMemo(() => {
        const usersMap = new Map();
        viewUsers.forEach(u => {
            usersMap.set(u.id, { id: u.id, name: u.name, totalImpact: 0, breakdown: { calls: 0, meetings: 0, emails: 0, creations: 0, movements: 0, comments: 0 } });
        });
        (activities || []).forEach(act => {
            if (!act.done) return;
            if (!isDateInRange(act.add_time || act.due_date, startDate, endDate)) return;
            const userId = act.user_id;
            if (!usersMap.has(userId)) return;
            const current = usersMap.get(userId);
            const type = act.type.toLowerCase();
            if (type === 'call') current.breakdown.calls += 1;
            else if (type === 'meeting') current.breakdown.meetings += 1;
            else if (type === 'email') current.breakdown.emails += 1;
            current.totalImpact += 1;
            usersMap.set(userId, current);
        });
        (notes || []).forEach(note => {
            if (!isDateInRange(note.add_time, startDate, endDate)) return;
            const userId = note.user_id;
            if (!usersMap.has(userId)) return;
            const current = usersMap.get(userId);
            current.breakdown.comments += 1;
            current.totalImpact += 2;
            usersMap.set(userId, current);
        });
        (allDeals || []).forEach(deal => {
            const dealUserId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
            const creatorId = Number(dealUserId);
            if (isDateInRange(deal.add_time, startDate, endDate) && usersMap.has(creatorId)) {
                const current = usersMap.get(creatorId);
                current.breakdown.creations += 1;
                current.totalImpact += 5;
                usersMap.set(creatorId, current);
            }
            if (deal.stage_change_time && isDateInRange(deal.stage_change_time, startDate, endDate) && usersMap.has(creatorId)) {
                const current = usersMap.get(creatorId);
                current.breakdown.movements += 1;
                current.totalImpact += 3;
                usersMap.set(creatorId, current);
            }
        });
        return Array.from(usersMap.values()).filter(u => u.totalImpact > 0 || selectedUserId === null);
    }, [activities, notes, allDeals, viewUsers, selectedUserId, startDate, endDate]);

    const performanceTableData = useMemo(() => {
        if (!viewUsers) return [];
        return viewUsers.map(user => {
            const userDeals = (allDeals || []).filter(d => {
                const dealUserId = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(dealUserId) === Number(user.id);
            });
            const stageCounts: Record<number, number> = {};
            (stages || []).forEach(s => { stageCounts[s.id] = userDeals.filter(d => d.stage_id === s.id && d.status === 'open').length; });
            const wonValue = userDeals.filter(d => d.status === 'won').reduce((sum, d) => sum + (d.value || 0), 0);
            return { id: user.id, name: user.name, stageCounts, totalDeals: userDeals.length, totalValue: wonValue };
        });
    }, [viewUsers, allDeals, stages]);

    const activitiesTableData = useMemo(() => {
        if (!viewUsers) return [];
        const now = new Date();
        return (activities || []).length > 0 ? viewUsers.map(user => {
            const ua = (activities || []).filter(a => a.user_id === user.id);
            return {
                id: user.id, name: user.name, total: ua.length,
                onTime: ua.filter(a => a.done || (a.due_date && new Date(a.due_date) >= now)).length,
                overdue: ua.filter(a => !a.done && a.due_date && new Date(a.due_date) < now).length,
                pending: ua.filter(a => !a.done).length
            };
        }) : [];
    }, [viewUsers, activities]);

    if (loading) return (
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
            <Header title="Painel de Controlo" />
            <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Sincronizando Insights do CRM...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white overflow-x-hidden">
            <Header title="Manager Insights" />

            <main className="p-8 flex-1 space-y-8 max-w-[1600px] mx-auto w-full relative">

                {/* Settings Panel */}
                {showSettings && (
                    <div className="absolute top-24 right-8 z-50 w-72 bg-[#0f1115]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/10">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Personalizar Vista</h4>
                        <div className="space-y-5">
                            {[
                                { label: 'Valor em Pipeline', val: showPipelineValue, fn: () => updateSettings({ showPipelineValue: !showPipelineValue }) },
                                { label: 'Win Rate Global',   val: showWinRate,       fn: () => updateSettings({ showWinRate: !showWinRate }) },
                                { label: 'Ranking Vendas',    val: showLeaderboard,   fn: () => updateSettings({ showLeaderboard: !showLeaderboard }) },
                            ].map(({ label, val, fn }) => (
                                <button key={label} onClick={fn} className="flex items-center justify-between w-full">
                                    <span className={`text-xs font-bold transition-colors ${val ? 'text-white' : 'text-gray-500'}`}>{label}</span>
                                    {val ? <Eye className="w-4 h-4 text-blue-500" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
                                </button>
                            ))}
                            <div className="pt-4 mt-2 border-t border-white/5">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-4 block">Módulo Lateral Padrão</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['activities', 'leaderboard'] as const).map(m => (
                                        <button key={m} onClick={() => updateSettings({ defaultModule: m })}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all border ${defaultModule === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
                                            {m === 'activities' ? 'ATIVIDADES' : 'RANKING'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowSettings(false)} className="w-full mt-8 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest transition-all">
                            Fechar
                        </button>
                    </div>
                )}

                {/* Export Menu */}
                {showExportMenu && (
                    <div className="absolute top-24 right-48 z-50 w-56 bg-[#0f1115]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl ring-1 ring-white/10">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Exportar Dados</h4>
                        <div className="space-y-2">
                            <button onClick={handleExportPDF} className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-white group">
                                <FileText className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" /> Exportar PDF
                            </button>
                            <button onClick={handleExportCSV} className="flex items-center gap-3 w-full p-2 hover:bg-white/5 rounded-xl transition-colors text-sm font-medium text-white group">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" /> Exportar CSV
                            </button>
                        </div>
                    </div>
                )}

                {/* Header Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Manager Dashboard</h1>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                <span className="text-blue-400 font-black uppercase tracking-widest text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">LIVE OPS</span>
                            </div>
                            <span className="text-gray-500 font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-tighter">
                                <Calendar className="w-3 h-3 text-blue-500/50" />
                                {mounted ? new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) : '...'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setShowExportMenu(!showExportMenu); setShowSettings(false); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-lg ${showExportMenu ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-gray-400'}`}>
                            <Download className="w-4 h-4" /> Exportar
                        </button>
                        <button onClick={() => { setShowSettings(!showSettings); setShowExportMenu(false); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-lg ${showSettings ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5 text-gray-400'}`}>
                            <Settings2 className="w-4 h-4" /> Personalizar
                        </button>
                        <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 transition-all border border-white/5 active:scale-95">
                            <RefreshCw className="w-4 h-4" /> Sync
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div id="dashboard-content" className="space-y-8">

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard title="Deals Ativos" value={metrics.activeCount} icon={Target} color="blue" trend={{ value: 12, isPositive: true }} />
                        {showPipelineValue && <MetricCard title="Valor em Pipeline" value={formatCurrency(metrics.totalValue)} icon={DollarSign} color="purple" />}
                        {showWinRate && <MetricCard title="Win Rate Global" value={`${metrics.winRate}%`} icon={TrendingUp} color="green" />}
                        <MetricCard title="Deals Perdidos" value={metrics.lostCount} icon={XCircle} color="red" />
                    </div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left: Funnel + Charts + Tables + Heatmap */}
                        <div className="lg:col-span-8 space-y-8">
                            <VisualFunnel data={funnelData} />
                            <WonLostChart won={metrics.wonCount} lost={metrics.lostCount} lostReasons={lostReasons} />

                            <div className="space-y-8 pt-4">
                                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                    <ActivitiesTable members={activitiesTableData} />
                                </div>
                                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/[0.04] shadow-2xl">
                                    <PerformanceTable title="Performance de Equipa por Stage" members={performanceTableData} stages={stages} />
                                </div>

                                {/* 🆕 Heatmap de Produtividade */}
                                <HeatmapChart activities={activities} />
                            </div>
                        </div>

                        {/* Right: FocusZone + Activity/Leaderboard */}
                        <div className="lg:col-span-4 space-y-8">
                            <FocusZone deals={allDeals} stages={stages} />
                            {defaultModule === 'activities' ? (
                                <ActiveSalespeople data={activeSalespeopleData} />
                            ) : (
                                showLeaderboard && <Leaderboard data={leaderboardData} />
                            )}
                            {defaultModule === 'activities' && showLeaderboard && <Leaderboard data={leaderboardData} />}
                            {defaultModule === 'leaderboard' && !showLeaderboard && <ActiveSalespeople data={activeSalespeopleData} />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
