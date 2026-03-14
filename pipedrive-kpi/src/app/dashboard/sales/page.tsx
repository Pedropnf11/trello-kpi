"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Deal, Stage, Activity } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';
import VisualFunnel from '@/components/dashboard/VisualFunnel';
import TodaysFocus from '@/components/dashboard/TodaysFocus';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import StuckLeads from '@/components/dashboard/StuckLeads';
import Sidebar from '@/components/layout/Sidebar';
import {
    TrendingUp, XCircle, DollarSign, Loader2,
    Settings2, Eye, EyeOff, BarChart2, Snowflake,
    Phone, Mail, Users, MessageSquare, X, Menu,
    AlertTriangle, CheckSquare, Clock,
} from 'lucide-react';

// ── Tabela unificada: Stage + Atividade + Dias médios parado ─────────────────
function StageSummaryTable({
    deals, stages, activities, notes,
}: {
    deals: Deal[]; stages: Stage[]; activities: Activity[]; notes: any[];
}) {
    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
    const now = new Date();

    const rows = useMemo(() => {
        return stages.map(stage => {
            const openDeals = deals.filter(d => d.stage_id === stage.id && d.status === 'open');
            if (openDeals.length === 0) return null;
            const dealIds = new Set(openDeals.map(d => d.id));
            const stageActs = activities.filter(a => a.done && a.deal_id !== null && dealIds.has(a.deal_id as number));
            const avgDaysStuck = Math.round(
                openDeals.reduce((sum, d) => {
                    const ref = d.last_activity_date || d.stage_change_time || d.add_time;
                    return sum + Math.floor((now.getTime() - new Date(ref).getTime()) / 86400000);
                }, 0) / openDeals.length
            );
            return {
                id: stage.id, name: stage.name,
                count: openDeals.length,
                value: openDeals.reduce((s, d) => s + (d.value || 0), 0),
                calls:    stageActs.filter(a => a.type?.toLowerCase() === 'call').length,
                emails:   stageActs.filter(a => a.type?.toLowerCase() === 'email').length,
                meetings: stageActs.filter(a => a.type?.toLowerCase() === 'meeting').length,
                notes:    notes.filter(n => n.deal_id !== null && dealIds.has(n.deal_id)).length,
                avgDaysStuck,
            };
        }).filter(Boolean) as any[];
    }, [deals, stages, activities, notes]);

    const totals = useMemo(() => rows.reduce(
        (acc, r) => ({ count: acc.count + r.count, value: acc.value + r.value, calls: acc.calls + r.calls, emails: acc.emails + r.emails, meetings: acc.meetings + r.meetings, notes: acc.notes + r.notes }),
        { count: 0, value: 0, calls: 0, emails: 0, meetings: 0, notes: 0 }
    ), [rows]);

    const ColHeader = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
        <th className={`px-4 py-3 text-[10px] font-black text-gray-600 uppercase tracking-widest ${right ? 'text-right' : 'text-center'}`}>{children}</th>
    );
    const NumCell = ({ value, accent }: { value: number; accent?: boolean }) => (
        <td className="px-4 py-3.5 text-center">
            {value > 0 ? (
                <span className={`inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-lg text-[11px] font-black border ${accent ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/[0.05] border-white/[0.08] text-gray-300'}`}>{value}</span>
            ) : <span className="text-gray-700 text-sm">—</span>}
        </td>
    );
    const daysColor = (d: number) => d <= 7 ? 'text-green-400' : d <= 14 ? 'text-yellow-400' : 'text-rose-400';

    return (
        <div className="bg-[#0f1115]/80 backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl w-full">
            <div className="px-6 pt-5 pb-4 border-b border-white/[0.05] flex items-center gap-2.5">
                <span className="w-1.5 h-4 rounded-full bg-blue-500/50"></span>
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em]">Resumo por Stage</h3>
                <span className="ml-auto text-[10px] font-black text-gray-500 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">{totals.count} abertos</span>
            </div>
            {rows.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-600 text-[11px] font-bold">Sem deals em aberto</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                <th className="px-6 py-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">Stage</th>
                                <ColHeader>Deals</ColHeader>
                                <ColHeader right>Valor</ColHeader>
                                <ColHeader><span className="flex items-center justify-center gap-1"><Phone className="w-3 h-3" /> Chamadas</span></ColHeader>
                                <ColHeader><span className="flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> Emails</span></ColHeader>
                                <ColHeader><span className="flex items-center justify-center gap-1"><Users className="w-3 h-3" /> Reuniões</span></ColHeader>
                                <ColHeader><span className="flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" /> Notas</span></ColHeader>
                                <ColHeader><span className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Dias médios</span></ColHeader>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {rows.map(row => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-3.5"><span className="text-[12px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{row.name}</span></td>
                                    <NumCell value={row.count} accent />
                                    <td className="px-4 py-3.5 text-right"><span className="text-[12px] font-black text-gray-200 tabular-nums">{fmt(row.value)}</span></td>
                                    <NumCell value={row.calls} />
                                    <NumCell value={row.emails} />
                                    <NumCell value={row.meetings} />
                                    <NumCell value={row.notes} />
                                    <td className="px-4 py-3.5 text-center"><span className={`text-[12px] font-black tabular-nums ${daysColor(row.avgDaysStuck)}`}>{row.avgDaysStuck}d</span></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-white/[0.06]">
                                <td className="px-6 py-3.5 text-[10px] font-black text-gray-600 uppercase tracking-widest">Total</td>
                                <td className="px-4 py-3.5 text-center"><span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-400">{totals.count}</span></td>
                                <td className="px-4 py-3.5 text-right"><span className="text-[12px] font-black text-white tabular-nums">{fmt(totals.value)}</span></td>
                                <NumCell value={totals.calls} />
                                <NumCell value={totals.emails} />
                                <NumCell value={totals.meetings} />
                                <NumCell value={totals.notes} />
                                <td className="px-4 py-3.5 text-center text-gray-700 text-sm">—</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function SalesDashboard() {
    const token              = useAppStore(s => s.token);
    const selectedPipelineId = useAppStore(s => s.selectedPipelineId);
    const currentUserId      = useAppStore(s => s.userId);
    const currentUserName    = useAppStore(s => s.userName);
    const startDate          = useAppStore(s => s.startDate);
    const endDate            = useAppStore(s => s.endDate);

    const { showFunnel, showFocusZone, showActivityTimeline, showActivitiesTable: showStuckLeads, showClosedRevenue, showWinRate, showPipelineOpen } = useAppStore(s => s.salesDashboardSettings) as any;
    const updateSalesSettings = useAppStore(s => s.updateSalesDashboardSettings);

    const [deals, setDeals]               = useState<Deal[]>([]);
    const [stages, setStages]             = useState<Stage[]>([]);
    const [activities, setActivities]     = useState<Activity[]>([]);
    const [notes, setNotes]               = useState<any[]>([]);
    const [loading, setLoading]           = useState(true);
    const [isSyncing, setIsSyncing]       = useState(false);
    const [lastSynced, setLastSynced]     = useState<Date | null>(null);
    const [error, setError]               = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const fetchData = useCallback(async (silent = false) => {
        if (!token || !selectedPipelineId) return;
        if (silent) setIsSyncing(true);
        else { setLoading(true); setError(null); }
        try {
            const api = new PipedriveAPI(token);
            const [d, s, a, n] = await Promise.all([
                api.getDeals(selectedPipelineId),
                api.getStages(selectedPipelineId),
                api.getActivities(currentUserId || undefined),
                api.getNotes(currentUserId || undefined),
            ]);
            setDeals(d);
            setStages(s.sort((a: any, b: any) => a.order_nr - b.order_nr));
            setActivities(a);
            setNotes(n);
            setLastSynced(new Date());
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar');
        } finally {
            setLoading(false);
            setIsSyncing(false);
        }
    }, [token, selectedPipelineId, currentUserId]);

    useEffect(() => { fetchData(); }, [fetchData]);
    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 768) setMobileSidebarOpen(false); };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const isInRange = (dateStr: string | null) => {
        if (!dateStr) return false;
        if (!startDate && !endDate) return true;
        const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
        if (startDate) { const s = new Date(startDate); s.setHours(0, 0, 0, 0); if (d < s) return false; }
        if (endDate)   { const e = new Date(endDate);   e.setHours(23, 59, 59, 999); if (d > e) return false; }
        return true;
    };

    const myAllDeals = useMemo(() => deals.filter((d: any) => {
        const uid = typeof d.user_id === 'object' ? d.user_id?.id : d.user_id;
        return Number(uid) === Number(currentUserId);
    }), [deals, currentUserId]);

    const myDeals = useMemo(() => myAllDeals.filter(deal => {
        if (deal.status === 'open')  return isInRange(deal.add_time);
        if (deal.status === 'won')   return isInRange(deal.won_time);
        if (deal.status === 'lost')  return isInRange(deal.lost_time);
        return true;
    }), [myAllDeals, startDate, endDate]);

    const kpis = useMemo(() => {
        const won  = myDeals.filter(d => d.status === 'won');
        const lost = myDeals.filter(d => d.status === 'lost');
        const open = myAllDeals.filter(d => d.status === 'open');
        const wonVal  = won.reduce((s, d) => s + (d.value || 0), 0);
        const openVal = open.reduce((s, d) => s + (d.value || 0), 0);
        const total   = won.length + lost.length;
        const winRate = total > 0 ? Math.round((won.length / total) * 100) : 0;
        const stuckCount = myAllDeals.filter(d => {
            if (d.status !== 'open') return false;
            const ref = d.last_activity_date || d.stage_change_time || d.add_time;
            return Math.floor((Date.now() - new Date(ref).getTime()) / 86400000) >= 7;
        }).length;
        const todayStr    = new Date().toISOString().split('T')[0];
        const todayCount  = activities.filter(a => !a.done && a.due_date === todayStr).length;
        const overdueCount = activities.filter(a => !a.done && a.due_date && a.due_date < todayStr).length;
        return { wonCount: won.length, wonVal, lostCount: lost.length, openCount: open.length, openVal, winRate, stuckCount, todayCount, overdueCount };
    }, [myDeals, myAllDeals, activities]);

    const funnelData = useMemo(() => stages.map(stage => {
        const ds = myAllDeals.filter(d => d.stage_id === stage.id && d.status === 'open');
        return { name: stage.name, value: ds.reduce((s, d) => s + (d.value || 0), 0), deals: ds.length };
    }), [stages, myAllDeals]);

    const fmt = (v: number) =>
        new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

    const greeting = useMemo(() => {
        const h = new Date().getHours();
        return h < 12 ? 'Bom dia' : h < 19 ? 'Boa tarde' : 'Boa noite';
    }, []);

    const contextLine = useMemo(() => {
        const parts: string[] = [];
        if (kpis.overdueCount > 0) parts.push(`${kpis.overdueCount} tarefa${kpis.overdueCount !== 1 ? 's' : ''} atrasada${kpis.overdueCount !== 1 ? 's' : ''}`);
        if (kpis.todayCount > 0)   parts.push(`${kpis.todayCount} para hoje`);
        if (kpis.stuckCount > 0)   parts.push(`${kpis.stuckCount} lead${kpis.stuckCount !== 1 ? 's' : ''} parada${kpis.stuckCount !== 1 ? 's' : ''}`);
        return parts.length > 0 ? parts.join(' · ') : null;
    }, [kpis.overdueCount, kpis.todayCount, kpis.stuckCount]);

    const hasUrgent = kpis.overdueCount > 0;
    const _showClosedRevenue = showClosedRevenue !== false;
    const _showWinRate       = showWinRate !== false;
    const _showPipelineOpen  = showPipelineOpen !== false;

    const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) => (
        <button onClick={onChange} className="flex items-center justify-between w-full py-2.5 border-b border-white/[0.04] last:border-0">
            <span className={`text-[12px] font-bold transition-colors ${value ? 'text-gray-200' : 'text-gray-600'}`}>{label}</span>
            {value ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-700" />}
        </button>
    );

    if (loading) return (
        <div className="flex flex-col h-full bg-[#05070a] text-white">
            <Header title="Dashboard" />
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500/60 animate-spin" />
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">A carregar dados...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col h-full bg-[#05070a] text-white">
            <Header title="Erro" />
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-rose-500/8 border border-rose-500/15 p-6 rounded-2xl text-center max-w-sm">
                    <XCircle className="w-10 h-10 text-rose-400/60 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm mb-4">{error}</p>
                    <button onClick={() => fetchData()} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2 px-6 rounded-xl transition-colors text-sm">Tentar novamente</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-full bg-[#05070a] text-white">

            {/* Header mobile */}
            <header className="h-16 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="text-base font-bold text-white tracking-tight">O Meu Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    {isSyncing && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                    {lastSynced && !isSyncing && (
                        <span className="hidden sm:block text-[10px] text-gray-600 tabular-nums">
                            Sync {lastSynced.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button onClick={() => fetchData(true)} disabled={isSyncing} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all bg-white/[0.03] border-white/5 text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 disabled:opacity-50">
                        Sync
                    </button>
                </div>
            </header>

            {/* Mobile drawer */}
            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-[280px] shadow-2xl overflow-y-auto" style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between px-5 pt-5 pb-4">
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Menu</p>
                            <button onClick={() => setMobileSidebarOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="pb-6"><Sidebar /></div>
                    </div>
                </div>
            )}

            <div className="p-4 md:p-6 lg:p-8 flex-1">
                <div className="max-w-[1600px] mx-auto space-y-6 relative">

                    {/* Personalizar */}
                    {showSettings && (
                        <div className="absolute top-0 right-0 z-50 w-60 bg-[#0d0f12]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-2xl">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">KPI Cards</p>
                            <div className="mb-4">
                                <ToggleRow label="Receita Fechada" value={_showClosedRevenue} onChange={() => (updateSalesSettings as any)({ showClosedRevenue: !_showClosedRevenue })} />
                                <ToggleRow label="Win Rate"        value={_showWinRate}       onChange={() => (updateSalesSettings as any)({ showWinRate: !_showWinRate })} />
                                <ToggleRow label="Pipeline Aberto" value={_showPipelineOpen}  onChange={() => (updateSalesSettings as any)({ showPipelineOpen: !_showPipelineOpen })} />
                            </div>
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 mt-4">Secções</p>
                            <div>
                                <ToggleRow label="Funil"          value={showFunnel}           onChange={() => updateSalesSettings({ showFunnel: !showFunnel })} />
                                <ToggleRow label="Leads Paradas"  value={showStuckLeads}       onChange={() => updateSalesSettings({ showActivitiesTable: !showStuckLeads })} />
                                <ToggleRow label="O que me falta" value={showFocusZone}        onChange={() => updateSalesSettings({ showFocusZone: !showFocusZone })} />
                                <ToggleRow label="O que fiz"      value={showActivityTimeline} onChange={() => updateSalesSettings({ showActivityTimeline: !showActivityTimeline })} />
                            </div>
                            <button onClick={() => setShowSettings(false)} className="w-full mt-4 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest transition-all">Fechar</button>
                        </div>
                    )}

                    {/* Cabeçalho com saudação contextual */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">{greeting}</p>
                            <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
                                {currentUserName?.split(' ')[0] || 'Vendedor'}
                            </h1>
                            {contextLine ? (
                                <p className={`text-[11px] font-bold mt-1.5 flex items-center gap-1.5 ${hasUrgent ? 'text-rose-400' : 'text-yellow-400/80'}`}>
                                    <AlertTriangle className="w-3 h-3 shrink-0" />{contextLine}
                                </p>
                            ) : (
                                <p className="text-[11px] font-bold mt-1.5 text-green-400/80 flex items-center gap-1.5">
                                    <CheckSquare className="w-3 h-3 shrink-0" />Tudo em dia — bom trabalho!
                                </p>
                            )}
                            {startDate && endDate && (
                                <p className="text-[10px] text-gray-600 mt-1 font-medium tabular-nums">
                                    {new Date(startDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                                    {' — '}
                                    {new Date(endDate).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all shrink-0 ${showSettings ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300'}`}
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Personalizar</span>
                        </button>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                        {_showClosedRevenue && (
                            <MetricCard title="Receita Fechada" value={fmt(kpis.wonVal)}
                                subtitle={`${kpis.wonCount} negócio${kpis.wonCount !== 1 ? 's' : ''} ganho${kpis.wonCount !== 1 ? 's' : ''}`}
                                icon={DollarSign} color="blue" />
                        )}
                        {_showWinRate && (
                            <MetricCard title="Win Rate" value={`${kpis.winRate}%`}
                                subtitle={`${kpis.wonCount + kpis.lostCount} fechados`}
                                icon={TrendingUp}
                                color={kpis.winRate >= 60 ? 'green' : kpis.winRate >= 30 ? 'blue' : 'red'} />
                        )}
                        {_showPipelineOpen && (
                            <MetricCard title="Pipeline Aberto" value={kpis.openCount}
                                subtitle={kpis.openCount === 1 ? 'oportunidade ativa' : 'oportunidades ativas'}
                                valueSecondary={fmt(kpis.openVal)}
                                icon={BarChart2} color="purple" />
                        )}
                        <MetricCard title="Leads Paradas" value={kpis.stuckCount}
                            subtitle={kpis.stuckCount > 0 ? 'Sem contacto há 7+ dias' : 'Pipeline activo'}
                            icon={Snowflake} color={kpis.stuckCount > 0 ? 'red' : 'blue'} />
                    </div>

                    {/* Funil + Leads Paradas */}
                    {(showFunnel || showStuckLeads) && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {showFunnel && (
                                <div className={showStuckLeads ? 'lg:col-span-7' : 'lg:col-span-12'}>
                                    <VisualFunnel data={funnelData} />
                                </div>
                            )}
                            {showStuckLeads && (
                                <div className={showFunnel ? 'lg:col-span-5' : 'lg:col-span-12'}>
                                    <StuckLeads
                                        deals={myAllDeals}
                                        stages={stages}
                                        notes={notes}
                                        userId={currentUserId}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* O que me falta */}
                    {showFocusZone && <TodaysFocus activities={activities} />}

                    {/* O que fiz */}
                    {showActivityTimeline && <ActivityFeed activities={activities} limit={12} />}

                    {/* Tabela unificada */}
                    <StageSummaryTable deals={myAllDeals} stages={stages} activities={activities} notes={notes} />

                </div>
            </div>
        </div>
    );
}
