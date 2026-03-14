"use client";

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Bell, Menu, RefreshCw } from 'lucide-react';
import WebhookSettingsModal from '@/components/modals/WebhookSettingsModal';

interface HeaderProps {
    title: string;
    onSync?: () => void;
    isSyncing?: boolean;
    lastSynced?: Date | null;
}

export default function Header({ title, onSync, isSyncing, lastSynced }: HeaderProps) {
    const userName = useAppStore(state => state.userName);
    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

    const syncLabel = isSyncing
        ? 'A sincronizar...'
        : lastSynced
            ? `Sync ${lastSynced.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
            : 'Sincronizar';

    return (
        <>
            <header className="h-16 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Botão Sync */}
                    {onSync && (
                        <button
                            onClick={onSync}
                            disabled={isSyncing}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                                isSyncing
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 cursor-not-allowed'
                                    : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400'
                            }`}
                        >
                            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{syncLabel}</span>
                        </button>
                    )}

                    {/* Notifications / Webhooks */}
                    <button
                        onClick={() => setIsWebhookModalOpen(true)}
                        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        title="Configurações de Alertas / Webhooks"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#05070a]"></span>
                    </button>

                    {/* Perfil */}
                    <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">{userName}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">Online</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 border border-white/10">
                            {userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            <WebhookSettingsModal
                isOpen={isWebhookModalOpen}
                onClose={() => setIsWebhookModalOpen(false)}
            />
        </>
    );
}
