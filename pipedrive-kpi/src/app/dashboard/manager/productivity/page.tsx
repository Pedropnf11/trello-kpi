"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Activity } from '@/types/pipedrive';
import Header from '@/components/layout/Header';
import HeatmapChart from '@/components/dashboard/HeatmapChart';
import TeamActivityFeed from '@/components/dashboard/manager/TeamActivityFeed';
import TeamActivityBriefing from '@/components/dashboard/manager/TeamActivityBriefing';
import { Loader2 } from 'lucide-react';

export default function ProductivityPage() {
    const token              = useAppStore(s => s.token);
    const selectedPipelineId = useAppStore(s => s.selectedPipelineId);
    const viewUsers          = useAppStore(s => s.viewUsers);

    const [activities, setActivities] = useState<Activity[]>([]);
    const [notes, setNotes]           = useState<any[]>([]);
    const [loading, setLoading]       = useState(true);
    const [isSyncing, setIsSyncing]   = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);

    const fetchData = useCallback(async (silent = false) => {
        if (!token) return;
        if (silent) setIsSyncing(true);
        else setLoading(true);
        try {
            const api = new PipedriveAPI(token);
            const [activitiesData, notesData] = await Promise.all([
                api.getActivities(),
                api.getNotes(),
            ]);
            setActivities(activitiesData);
            setNotes(notesData);
            setLastSynced(new Date());
        } catch { /**/ }
        finally { setLoading(false); setIsSyncing(false); }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) return (
        <div className="flex flex-col flex-1 items-center justify-center gap-4" style={{ background: 'var(--bg-base)' }}>
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--blue)' }} />
            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
                A carregar dados de produtividade...
            </p>
        </div>
    );

    return (
        <div className="flex flex-col flex-1 min-h-0" style={{ background: 'var(--bg-base)' }}>
            <Header
                title="Produtividade da Equipa"
                onSync={() => fetchData(true)}
                isSyncing={isSyncing}
                lastSynced={lastSynced}
            />

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                <div className="max-w-[1600px] mx-auto space-y-6">

                    {/* Título + descrição */}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                            Análise de equipa
                        </p>
                        <h1 className="text-2xl font-black tracking-tight mt-0.5" style={{ color: 'var(--text-primary)' }}>
                            Produtividade da Equipa
                        </h1>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                            Quando é que a equipa é mais activa · padrões de trabalho · feed de atividades
                        </p>
                    </div>

                    {/* Heatmap — largura total */}
                    <HeatmapChart activities={activities} />

                    {/* Briefing de hoje */}
                    <TeamActivityBriefing activities={activities} viewUsers={viewUsers} />

                    {/* Feed da equipa — largura total */}
                    <TeamActivityFeed activities={activities} viewUsers={viewUsers} limit={30} />

                </div>
            </div>
        </div>
    );
}
