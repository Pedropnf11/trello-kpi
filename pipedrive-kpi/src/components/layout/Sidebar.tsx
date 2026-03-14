"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import {
    LayoutDashboard, PieChart, Settings, LogOut,
    Zap, Users, ChevronRight, Calendar, X, Circle,
    RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PipedriveAPI } from '@/lib/pipedrive';
import WebhookSettingsModal from '@/components/modals/WebhookSettingsModal';

export default function Sidebar() {
    const pathname              = usePathname();
    const router                = useRouter();
    const token                 = useAppStore(s => s.token);
    const role                  = useAppStore(s => s.role);
    const selectedPipelineName  = useAppStore(s => s.selectedPipelineName);
    const viewUsers             = useAppStore(s => s.viewUsers);
    const setViewUsers          = useAppStore(s => s.setViewUsers);
    const selectedUserId        = useAppStore(s => s.selectedUserId);
    const setSelectedUserId     = useAppStore(s => s.setSelectedUserId);
    const startDate             = useAppStore(s => s.startDate);
    const endDate               = useAppStore(s => s.endDate);
    const setStartDate          = useAppStore(s => s.setStartDate);
    const setEndDate            = useAppStore(s => s.setEndDate);
    const logout                = useAppStore(s => s.logout);
    const resetPipelineAndRole  = useAppStore(s => s.resetPipelineAndRole);

    const [webhookOpen, setWebhookOpen]       = useState(false);
    const [confirmLogout, setConfirmLogout]   = useState(false);

    useEffect(() => {
        if (role === 'manager' && token && viewUsers.length === 0) {
            new PipedriveAPI(token).getUsers()
                .then(setViewUsers)
                .catch(console.error);
        }
    }, [role, token, viewUsers.length, setViewUsers]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleChangeRole = () => {
        resetPipelineAndRole();
        router.push('/');
    };

    const links = role === 'sales'
        ? [{ name: 'Dashboard', href: '/dashboard/sales',          icon: LayoutDashboard }]
        : [{ name: 'Dashboard', href: '/dashboard/manager',        icon: LayoutDashboard },
           { name: 'Gráficos',  href: '/dashboard/manager/charts', icon: PieChart        }];

    const quickRanges = [
        { label: '7d',  days: 7  },
        { label: '30d', days: 30 },
        { label: '90d', days: 90 },
    ];

    return (
        <>
            <aside
                className="hidden md:flex w-[240px] shrink-0 h-screen flex-col border-r"
                style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
            >
                {/* ── Logo ── */}
                <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--blue-dim)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <Zap className="w-4 h-4" style={{ color: 'var(--blue)' }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pipedrive KPI</p>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                {role === 'manager' ? 'Manager' : 'Sales'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

                    {/* ── Pipeline ativo ── */}
                    <div className="px-4 pt-4 pb-3">
                        <div className="px-3 py-2.5 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Pipeline</p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--blue)' }} />
                                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                                    {selectedPipelineName || '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Navegação ── */}
                    <nav className="px-3 space-y-0.5">
                        {links.map(({ name, href, icon: Icon }) => {
                            const active = href === '/dashboard/manager/charts'
                                ? pathname.includes('/charts')
                                : pathname === href;
                            return (
                                <Link key={name} href={href}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                                    style={{
                                        background: active ? 'var(--blue-dim)' : 'transparent',
                                        color: active ? 'var(--blue)' : 'var(--text-secondary)',
                                        border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                    }}>
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ── Período ── */}
                    <div className="px-4 pt-5 pb-3 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                style={{ color: 'var(--text-muted)' }}>
                                <Calendar className="w-3 h-3" /> Período
                            </p>
                            {(startDate || endDate) && (
                                <button onClick={() => { setStartDate(null); setEndDate(null); }}
                                    className="text-[9px] font-bold flex items-center gap-1 transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--rose)' }}>
                                    <X className="w-2.5 h-2.5" /> Limpar
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-1 mb-2">
                            {quickRanges.map(({ label, days }) => {
                                const e = new Date();
                                const s = new Date(); s.setDate(s.getDate() - days);
                                const ss = s.toISOString().split('T')[0];
                                const es = e.toISOString().split('T')[0];
                                const active = startDate === ss && endDate === es;
                                return (
                                    <button key={label}
                                        onClick={() => { setStartDate(ss); setEndDate(es); }}
                                        className="text-[10px] font-bold py-1.5 rounded-md transition-all"
                                        style={{
                                            background: active ? 'var(--blue-dim)' : 'var(--bg-surface)',
                                            color: active ? 'var(--blue)' : 'var(--text-muted)',
                                            border: `1px solid ${active ? 'rgba(59,130,246,0.25)' : 'var(--border)'}`,
                                        }}>
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {(['start', 'end'] as const).map(t => (
                            <div key={t} className="relative mb-1.5">
                                <input type="date"
                                    value={(t === 'start' ? startDate : endDate) || ''}
                                    onChange={e => t === 'start' ? setStartDate(e.target.value || null) : setEndDate(e.target.value || null)}
                                    className="w-full text-xs px-3 py-2 rounded-lg outline-none transition-all focus:ring-1"
                                    style={{
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)',
                                    }}
                                />
                                <span className="absolute right-3 top-2 text-[9px] font-black uppercase pointer-events-none"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {t === 'start' ? 'Início' : 'Fim'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Equipa (Manager only) ── */}
                    {role === 'manager' && (
                        <div className="px-4 pt-4 flex-1 flex flex-col min-h-0 border-t" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                    style={{ color: 'var(--text-muted)' }}>
                                    <Users className="w-3 h-3" /> Equipa
                                </p>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    {viewUsers.length}
                                </span>
                            </div>

                            <div className="space-y-0.5 overflow-y-auto flex-1 pr-1">
                                <button onClick={() => setSelectedUserId(null)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                    style={{
                                        background: selectedUserId === null ? 'var(--blue-dim)' : 'transparent',
                                        color: selectedUserId === null ? 'var(--blue)' : 'var(--text-secondary)',
                                        border: selectedUserId === null ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                    }}>
                                    <Circle className="w-2 h-2 shrink-0" style={{ fill: selectedUserId === null ? 'var(--blue)' : 'transparent' }} />
                                    Toda a Equipa
                                </button>

                                {viewUsers.map(u => (
                                    <button key={u.id} onClick={() => setSelectedUserId(u.id)}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                        style={{
                                            background: selectedUserId === u.id ? 'var(--blue-dim)' : 'transparent',
                                            color: selectedUserId === u.id ? 'var(--blue)' : 'var(--text-secondary)',
                                            border: selectedUserId === u.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                                        }}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                                                style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="truncate">{u.name}</span>
                                        </div>
                                        {selectedUserId === u.id && <ChevronRight className="w-3 h-3 shrink-0" style={{ color: 'var(--blue)' }} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="p-3 border-t space-y-0.5" style={{ borderColor: 'var(--border)' }}>

                    {/* Trocar função */}
                    <button
                        onClick={handleChangeRole}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5 group"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <RefreshCw className="w-4 h-4 shrink-0 transition-colors" style={{ color: 'var(--text-muted)' }} />
                        <span>Trocar função</span>
                    </button>

                    {/* Integrações */}
                    <button
                        onClick={() => setWebhookOpen(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-white/5"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <Settings className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                        Integrações (Make)
                    </button>

                    {/* Logout — com confirmação inline */}
                    {confirmLogout ? (
                        <div className="px-3 py-2 rounded-lg border"
                            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
                            <p className="text-[10px] font-bold text-red-400 mb-2">Tens a certeza?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-1.5 rounded-lg text-[10px] font-black text-white bg-red-600 hover:bg-red-500 transition-colors"
                                >
                                    Sair
                                </button>
                                <button
                                    onClick={() => setConfirmLogout(false)}
                                    className="flex-1 py-1.5 rounded-lg text-[10px] font-black transition-colors"
                                    style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmLogout(true)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-red-500/10 group"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <LogOut className="w-4 h-4 shrink-0 transition-colors group-hover:text-red-400" style={{ color: 'var(--text-muted)' }} />
                            <span className="group-hover:text-red-400 transition-colors">Sair</span>
                        </button>
                    )}
                </div>
            </aside>

            <WebhookSettingsModal isOpen={webhookOpen} onClose={() => setWebhookOpen(false)} />
        </>
    );
}
