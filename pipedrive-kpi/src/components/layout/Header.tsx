"use client";

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Bell, Search, Menu } from 'lucide-react';
import WebhookSettingsModal from '@/components/modals/WebhookSettingsModal';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const userName = useAppStore(state => state.userName);
    const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);

    return (
        <>
            <header className="h-20 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Bar */}
                    <div className="hidden md:flex relative group">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Procurar negócios..."
                            className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all w-64"
                        />
                    </div>

                    {/* Notifications */}
                    <button
                        onClick={() => setIsWebhookModalOpen(true)}
                        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                        title="Configurações de Alertas / Webhooks"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#05070a]"></span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">{userName}</p>
                            <p className="text-xs text-gray-400 mt-1">Online</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 border border-white/10">
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
