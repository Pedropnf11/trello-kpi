"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Deal, Stage, Activity } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import VisualFunnel from '@/components/dashboard/VisualFunnel';
import Leaderboard from '@/components/dashboard/Leaderboard';
import PerformanceTable from '@/components/dashboard/PerformanceTable';
import ActivitiesTable from '@/components/dashboard/ActivitiesTable';
import TeamActivityFeed from '@/components/dashboard/manager/TeamActivityFeed';
import StageSummaryTable from '@/components/dashboard/manager/StageSummaryTable';
import StuckLeads from '@/components/dashboard/StuckLeads';
import {
    TrendingUp, Target, DollarSign, Loader2,
    ShieldAlert, Eye, EyeOff, Download,
    FileText, FileSpreadsheet, Settings2,
} from 'lucide-react';

export default function ManagerDashboard() {
    const token              = useAppStore(s => s.token);
    const selectedPipelineId = useAppStore(s => s.selectedPipelineId);
    const selectedUserId     = useAppStore(s => s.selectedUserId);
    const viewUsers          = useAppStore(s => s.viewUsers);
    const startDate          = useAppStore(s => s.startDate);
    const endDate            = useAppStore(s => s.endDate);
    const { showPipelineValue, showWinRate, showLeaderboard, defaultModule } = useAppStore(s => s.dashboardSettings);
    const updateSettings     = useAppStore(s => s.updateDashboardSettings);

    const [deals, setDeals]           = useState<Deal[]>([]);
    const [allDeals, setAllDeals]     = useState<Deal[]>([]);
    const [stages, setStages]         = useState<Stage[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notes, setNotes]           = useState<any[]>([]);
    const [loading, setLoading]       = useState(true);
    const [isSyncing, setIsSyncing]   = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);
    const [showSettings, setShowSettings]     = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (!token || !selectedPipelineId) return;
        if (silent) setIsSyncing(true);
        else setLoading(true);
        try {
            const api = new PipedriveAPI(token);
            const [dealsData, allDealsData, stagesData, activitiesData, notesData] = await Promise.all([
                api.getDeals(selectedPipelineId),
                api.getAllDeals('open'),
                api.getStages(selectedPipelineId),
                api.getActivities(),
                api.getNotes(),
            ]);
            setDeals(dealsData);
            setAllDeals(allDealsData);
            setStages(stagesData.sort((a, b) => a.order_nr - b.order_nr));
            setActivities(activitiesData);
            setNotes(notesData);
            setLastSynced(new Date());
        } catch { /**/ }
        finally { setLoading(false); setIsSyncing(false); }
    }, [token, selectedPipelineId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleExportPDF = async () => {
        setShowExportMenu(false);
        const element = document.getElementById('dashboard-content');
        if (!element) return;
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            html2pdf().set({
                margin: 0.5,
                filename: `Manager-${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' as const },
            }).from(element).save();
        } catch { /**/ }
    };

    const handleExportCSV = () => {
        setShowExportMenu(false);
        let csv = 'data:text/csv;charset=utf-8,ID,Negócio,Valor,Status\n';
        filteredDeals.forEach(d => { csv += `${d.id},"${d.title}",${d.value || 0},${d.status}\n`; });
        const a = Object.assign(document.createElement('a'), {
            href: encodeURI(csv),
            download: `Manager-${new Date().toISOString().split('T')[0]}.csv`,
        });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const isInRange = (dateStr: string | null) => {
        if (!dateStr) return false;
        if (!startDate && !endDate) return true;
        const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
        if (startDate) { const s = new Date(startDate); s.setHours(0,0,0,0); if (d < s) return false; }
        if (endDate)   { const e = new Date(endDate);   e.setHours(23,59,59,999); if (d > e) return false; }
        return true;
    };

    const filteredDeals = useMemo(() => {
        let r = deals;
        if (selectedUserId !== null) {
            r = r.filter(d => {
                const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(uid) === Number(selectedUserId);
            });
        }
        return r.filter(d => {
            if (d.status === 'open')  return isInRange(d.add_time);
            if (d.status === 'won')   return isInRange(d.won_time);
            if (d.status === 'lost')  return isInRange(d.lost_time);
            return true;
        });
    }, [deals, selectedUserId, startDate, endDate]);

    const metrics = useMemo(() => {
        const active = filteredDeals.filter(d => d.status === 'open');
        const won    = filteredDeals.filter(d => d.status === 'won');
        const lost   = filteredDeals.filter(d => d.status === 'lost');
        const criticalCount = allDeals.filter(d => {
            if (d.status !== 'open') return false;
            const ref = d.last_activity_date || d.stage_change_time || d.add_time;
            return Math.floor((Date.now() - new Date(ref).getTime()) / 86400000) >= 14;
        }).length;
        return {
            activeCount:  active.length,
            totalValue:   active.reduce((s, d) => s + (d.value || 0), 0),
            wonCount:     won.length,
            lostCount:    lost.length,
            winRate:      (won.length + lost.length) > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0,
            criticalCount,
        };
    }, [filteredDeals, allDeals]);

    const funnelData = useMemo(() =>
        stages.map(stage => {
            const sd    = filteredDeals.filter(d => d.stage_id === stage.id && d.status === 'open');
            const allSd = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
            const avgDays = allSd.length
                ? Math.round(allSd.reduce((s, d) => s + Math.floor((Date.now() - new Date(d.stage_change_time || d.add_time).getTime()) / 86400000), 0) / allSd.length)
                : 0;
            return { name: stage.name, value: sd.reduce((s, d) => s + (d.value || 0), 0), deals: sd.length, avgDays };
        }),
    [stages, deals, filteredDeals]);

    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    const leaderboardData = useMemo(() => {
        const map = new Map<number, { id: number; name: string; value: number; deals: number }>();
        filteredDeals.filter(d => d.status === 'won').forEach(d => {
            const uid  = typeof d.user_id === 'object' ? d.user_id?.id : Number(d.user_id);
            const name = typeof d.user_id === 'object' ? d.user_id?.name : 'Vendedor';
            const cur  = map.get(uid) || { id: uid, name, value: 0, deals: 0 };
            map.set(uid, { ...cur, value: cur.value + (d.value || 0), deals: cur.deals + 1 });
        });
        return Array.from(map.values()).sort((a, b) => b.deals - a.deals);
    }, [filteredDeals]);

    const performanceTableData = useMemo(() =>
        viewUsers.map(user => {
            const ud = allDeals.filter(d => {
                const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
                return Number(uid) === Number(user.id);
            });
            const stageCounts: Record<number, number> = {};
            stages.forEach(s => { stageCounts[s.id] = ud.filter(d => d.stage_id === s.id && d.status === 'open').length; });
            return {
                id: user.id, name: user.name, stageCounts,
                totalDeals: ud.length,
                totalValue: ud.filter(d => d.status === 'won').reduce((s, d) => s + (d.value || 0), 0),
            };
        }),
    [viewUsers, allDeals, stages]);

    const activitiesTableData = useMemo(() => {
        const now = new Date();
        return viewUsers.map(user => {
            const ua = activities.filter(a => a.user_id === user.id);
            return {
                id: user.id, name: user.name, total: ua.length,
                onTime:  ua.filter(a => a.done || (a.due_date && new Date(a.due_date) >= now)).length,
                overdue: ua.filter(a => !a.done && a.due_date && new Date(a.due_date) < now).length,
                pending: ua.filter(a => !a.done).length,
            };
        });
    }, [viewUsers, activities]);

    const contextLine = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const overdueCount  = activities.filter(a => !a.done && a.due_date && a.due_date < todayStr).length;
        const inactiveUsers = viewUsers.filter(u => !activities.some(a => a.user_id === u.id && a.done)).length;
        const parts: string[] = [];
        if (metrics.criticalCount > 0) parts.push(`${metrics.criticalCount} deal${metrics.criticalCount !== 1 ? 's' : ''} crítico${metrics.criticalCount !== 1 ? 's' : ''}`);
        if (overdueCount > 0) parts.push(`${overdueCount} follow-up${overdueCount !== 1 ? 's' : ''} atrasado${overdueCount !== 1 ? 's' : ''}`);
        if (inactiveUsers > 0) parts.push(`${inactiveUsers} vendedor${inactiveUsers !== 1 ? 'es' : ''} sem atividade`);
        return parts.length > 0 ? parts.join(' · ') : null;
    }, [activities, viewUsers, metrics.criticalCount]);

    if (loading) return (
        <div className="flex flex-col flex-1 items-center justify-center gap-4" style={{ background: 'var(--bg-base)' }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--blue)' }} />
            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
                Sincronizando insights do CRM...
            </p>
        </div>
    );

    const ToggleRow = ({ label, val, fn }: { label: string; val: boolean; fn: () => void }) => (
        <button onClick={fn} className="flex items-center justify-between w-full py-2 border-b last:border-0"
            style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs font-bold" style={{ color: val ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
            {val
                ? <Eye className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                : <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            }
        </button>
    );

    return (
        <div className="flex flex-col flex-1 min-h-0" style={{ background: 'var(--bg-base)' }}>
            <Header
                title="Manager Dashboard"
                onSync={() => fetchData(true)}
                isSyncing={isSyncing}
                lastSynced={lastSynced}
            />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                <div className="max-w-[1600px] mx-auto space-y-6 relative">

                    {/* Settings panel */}
                    {showSettings && (
                        <div className="absolute top-0 right-0 z-50 w-64 rounded-2xl p-5 shadow-2xl"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-4 pb-3"
                                style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                Personalizar vista
                            </p>
                            <div className="space-y-0.5">
                                <ToggleRow label="Valor em Pipeline" val={showPipelineValue} fn={() => updateSettings({ showPipelineValue: !showPipelineValue })} />
                                <ToggleRow label="Win Rate Global"   val={showWinRate}       fn={() => updateSettings({ showWinRate: !showWinRate })} />
                                <ToggleRow label="Ranking Vendas"    val={showLeaderboard}   fn={() => updateSettings({ showLeaderboard: !showLeaderboard })} />
                            </div>
                            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Módulo lateral</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['activities', 'leaderboard'] as const).map(m => (
                                        <button key={m} onClick={() => updateSettings({ defaultModule: m })}
                                            className="py-1.5 rounded-lg text-[10px] font-black transition-all"
                                            style={{
                                                background: defaultModule === m ? 'var(--blue-dim)' : 'var(--bg-surface)',
                                                color:      defaultModule === m ? 'var(--blue)' : 'var(--text-muted)',
                                                border:     `1px solid ${defaultModule === m ? 'rgba(59,130,246,0.25)' : 'var(--border)'}`,
                                            }}>
                                            {m === 'activities' ? 'Feed equipa' : 'Ranking'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setShowSettings(false)}
                                className="w-full mt-4 py-2 rounded-xl text-[10px] font-black transition-all"
                                style={{ background: 'var(--bg-surface)', color: 'var(--blue)', border: '1px solid var(--border)' }}>
                                Fechar
                            </button>
                        </div>
                    )}

                    {/* Export menu */}
                    {showExportMenu && (
                        <div className="absolute top-0 right-40 z-50 w-52 rounded-2xl p-4 shadow-2xl"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-3 pb-2"
                                style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                                Exportar dados
                            </p>
                            <div className="space-y-1">
                                {[
                                    { label: 'Exportar PDF', icon: FileText,       fn: handleExportPDF, accent: '#f43f5e' },
                                    { label: 'Exportar CSV', icon: FileSpreadsheet, fn: handleExportCSV, accent: '#10b981' },
                                ].map(({ label, icon: Icon, fn, accent }) => (
                                    <button key={label} onClick={fn}
                                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                                        style={{ color: 'var(--text-primary)' }}>
                                        <Icon className="w-4 h-4" style={{ color: accent }} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cabeçalho */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                                {new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 19 ? 'Boa tarde' : 'Boa noite'}
                            </p>
                            <h1 className="text-2xl font-black tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                                Manager Dashboard
                            </h1>
                            {contextLine ? (
                                <p className="text-[11px] font-bold mt-1.5 flex items-center gap-1.5" style={{ color: 'var(--rose)' }}>
                                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {contextLine}
                                </p>
                            ) : (
                                <p className="text-[11px] font-bold mt-1.5" style={{ color: 'var(--green)' }}>Equipa em dia</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                            <button onClick={() => { setShowExportMenu(!showExportMenu); setShowSettings(false); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                style={{
                                    background: showExportMenu ? 'var(--blue-dim)' : 'var(--bg-surface)',
                                    color:      showExportMenu ? 'var(--blue)' : 'var(--text-secondary)',
                                    border:     `1px solid ${showExportMenu ? 'rgba(59,130,246,0.25)' : 'var(--border)'}`,
                                }}>
                                <Download className="w-3.5 h-3.5" /> Exportar
                            </button>
                            <button onClick={() => { setShowSettings(!showSettings); setShowExportMenu(false); }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                style={{
                                    background: showSettings ? 'var(--blue-dim)' : 'var(--bg-surface)',
                                    color:      showSettings ? 'var(--blue)' : 'var(--text-secondary)',
                                    border:     `1px solid ${showSettings ? 'rgba(59,130,246,0.25)' : 'var(--border)'}`,
                                }}>
                                <Settings2 className="w-3.5 h-3.5" /> Personalizar
                            </button>
                        </div>
                    </div>

                    <div id="dashboard-content" className="space-y-6">

                        {/* Metric cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <MetricCard title="Deals Ativos"   value={metrics.activeCount}   icon={Target}     color="blue" />
                            {showPipelineValue && <MetricCard title="Valor Pipeline" value={fmt(metrics.totalValue)} icon={DollarSign} color="purple" />}
                            {showWinRate       && <MetricCard title="Win Rate"       value={`${metrics.winRate}%`}   icon={TrendingUp} color="green" />}
                            <MetricCard title="Deals Críticos" value={metrics.criticalCount} icon={ShieldAlert}
                                color={metrics.criticalCount > 0 ? 'red' : 'blue'} subtitle="Parados ≥ 14 dias" />
                        </div>

                        {/* Funil + Módulo lateral */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            <div className="lg:col-span-8">
                                <VisualFunnel data={funnelData} />
                            </div>
                            <div className="lg:col-span-4 space-y-6">
                                {defaultModule === 'activities'
                                    ? <TeamActivityFeed activities={activities} viewUsers={viewUsers} />
                                    : showLeaderboard && <Leaderboard data={leaderboardData} />
                                }
                                {defaultModule === 'activities' && showLeaderboard && <Leaderboard data={leaderboardData} />}
                                {defaultModule === 'leaderboard' && !showLeaderboard && <TeamActivityFeed activities={activities} viewUsers={viewUsers} />}
                            </div>
                        </div>

                        {/* Leads Paradas — filtra por selectedUserId automaticamente */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-1 h-4 rounded-full shrink-0" style={{ background: 'var(--rose)' }} />
                                <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{ color: 'var(--text-secondary)' }}>
                                    Leads Paradas
                                    {selectedUserId !== null && viewUsers.find(u => u.id === selectedUserId) && (
                                        <span className="ml-2 font-bold normal-case tracking-normal" style={{ color: 'var(--blue)' }}>
                                            — {viewUsers.find(u => u.id === selectedUserId)?.name.split(' ')[0]}
                                        </span>
                                    )}
                                    {selectedUserId === null && (
                                        <span className="ml-2 font-bold normal-case tracking-normal" style={{ color: 'var(--text-muted)' }}>
                                            — Toda a equipa
                                        </span>
                                    )}
                                </p>
                            </div>
                            <StuckLeads
                                deals={allDeals}
                                stages={stages}
                                notes={notes}
                                userId={selectedUserId}
                            />
                        </div>

                        {/* Tabelas — largura total */}
                        <StageSummaryTable
                            deals={allDeals}
                            stages={stages}
                            activities={activities}
                            notes={notes}
                            viewUsers={viewUsers}
                        />

                        <div className="card p-6">
                            <ActivitiesTable members={activitiesTableData} />
                        </div>

                        <div className="card p-6">
                            <PerformanceTable
                                title="Performance Individual por Stage"
                                members={performanceTableData}
                                stages={stages}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
