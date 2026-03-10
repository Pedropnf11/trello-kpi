"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import {
    LayoutDashboard,
    PieChart,
    Settings,
    LogOut,
    Building2,
    Users,
    ChevronRight,
    Circle,
    Calendar,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PipedriveAPI } from '@/lib/pipedrive';
import WebhookSettingsModal from '@/components/modals/WebhookSettingsModal';

export default function Sidebar() {
    const pathname = usePathname();
    const token = useAppStore(state => state.token);
    const role = useAppStore(state => state.role);
    const userName = useAppStore(state => state.userName);
    const selectedPipelineName = useAppStore(state => state.selectedPipelineName);
    const viewUsers = useAppStore(state => state.viewUsers);
    const setViewUsers = useAppStore(state => state.setViewUsers);
    const selectedUserId = useAppStore(state => state.selectedUserId);
    const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
    const startDate = useAppStore(state => state.startDate);
    const endDate = useAppStore(state => state.endDate);
    const setStartDate = useAppStore(state => state.setStartDate);
    const setEndDate = useAppStore(state => state.setEndDate);
    const logout = useAppStore(state => state.logout);

    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

    // Fetch team members if in manager mode and not loaded
    useEffect(() => {
        if (role === 'manager' && token && viewUsers.length === 0) {
            const fetchUsers = async () => {
                try {
                    const api = new PipedriveAPI(token);
                    const users = await api.getUsers();
                    setViewUsers(users);
                } catch (err) {
                    console.error("Failed to fetch team members", err);
                }
            };
            fetchUsers();
        }
    }, [role, token, viewUsers.length, setViewUsers]);

    // Define links based on role
    const links = [
        {
            name: 'Dashboard',
            href: role === 'manager' ? '/dashboard/manager' : '/dashboard/sales',
            icon: LayoutDashboard,
            active: pathname === `/dashboard/${role}`
        },
        {
            name: 'Gráficos',
            href: `/dashboard/${role}/charts`,
            icon: PieChart,
            active: pathname.includes('/charts')
        }
    ];

    return (
        <>
            <aside className="w-64 h-screen border-r border-white/5 bg-[#05070a] flex flex-col justify-between hidden md:flex shrink-0 overflow-hidden">

                {/* Top Section */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white tracking-tight leading-tight">Pipedrive KPI</h2>
                                <p className="text-xs text-blue-400 font-medium tracking-wide lowercase">
                                    {role === 'manager' ? 'Admin / Manager' : 'Consultor / Sales'}
                                </p>
                            </div>
                        </div>

                        {/* Current Context */}
                        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Pipeline Ativo</p>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                <p className="text-sm font-semibold text-white truncate" title={selectedPipelineName || ''}>
                                    {selectedPipelineName}
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${link.active
                                            ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${link.active ? 'text-blue-400' : 'text-gray-500'}`} />
                                        <span className="text-sm">{link.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Period Section (Matches Trello structure) */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                Período
                            </h3>
                            {(startDate || endDate) && (
                                <button
                                    onClick={() => { setStartDate(null); setEndDate(null); }}
                                    className="text-[10px] text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 transition-colors"
                                >
                                    <X className="w-2 h-2" />
                                    Limpar
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate || ''}
                                    onChange={(e) => setStartDate(e.target.value || null)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40 focus:ring-0 transition-colors appearance-none"
                                />
                                <span className="absolute right-3 top-2.5 text-[10px] text-gray-600 pointer-events-none uppercase font-bold">Início</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={endDate || ''}
                                    onChange={(e) => setEndDate(e.target.value || null)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500/40 focus:ring-0 transition-colors appearance-none"
                                />
                                <span className="absolute right-3 top-2.5 text-[10px] text-gray-600 pointer-events-none uppercase font-bold">Fim</span>
                            </div>
                        </div>
                    </div>

                    {/* Team Section (Only for Manager) */}
                    {role === 'manager' && (
                        <div className="px-6 py-4 flex-1 flex flex-col min-h-0">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    Equipa
                                </h3>
                                <span className="bg-white/5 text-[10px] text-gray-400 px-1.5 py-0.5 rounded-md font-bold">{viewUsers.length}</span>
                            </div>

                            <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                <button
                                    onClick={() => setSelectedUserId(null)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs ${selectedUserId === null
                                        ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/10'
                                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                        }`}
                                >
                                    <Circle className={`w-2 h-2 ${selectedUserId === null ? 'fill-blue-400 text-blue-400' : 'text-gray-600'}`} />
                                    <span>Toda a Equipa</span>
                                </button>

                                {viewUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUserId(user.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs group ${selectedUserId === user.id
                                            ? 'bg-blue-600/10 text-blue-400 font-bold border border-blue-500/10'
                                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-6 h-6 rounded-full bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-[10px] shrink-0 text-blue-300">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="truncate">{user.name}</span>
                                        </div>
                                        {selectedUserId === user.id && <ChevronRight className="w-3 h-3 text-blue-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/5 space-y-1 bg-[#05070a]">
                    <button
                        onClick={() => setIsWebhookModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-blue-600/10 hover:text-blue-400 transition-all duration-200 border border-transparent hover:border-blue-500/20"
                    >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Integrações (Make)
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                    >
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                        Sair do Dashboard
                    </button>

                    <div className="mt-4 px-4 py-2 flex items-center gap-2 grayscale opacity-50">
                        <div className="w-4 h-4 rounded bg-white/20"></div>
                        <span className="text-[10px] font-bold text-gray-500 tracking-tighter uppercase">Powering Sales API</span>
                    </div>
                </div>

            </aside>

            <WebhookSettingsModal
                isOpen={isWebhookModalOpen}
                onClose={() => setIsWebhookModalOpen(false)}
            />
        </>
    );
}
