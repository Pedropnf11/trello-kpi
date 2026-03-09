"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Pipeline } from '@/types/pipedrive';
import { Loader2, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function PipelineSelector() {
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = useAppStore(state => state.token);
    const role = useAppStore(state => state.role);
    const setPipeline = useAppStore(state => state.setPipeline);
    const resetPipelineAndRole = useAppStore(state => state.resetPipelineAndRole);
    const logout = useAppStore(state => state.logout);

    useEffect(() => {
        if (!token) return;

        const fetchPipelines = async () => {
            try {
                const api = new PipedriveAPI(token);
                const fetchedPipelines = await api.getPipelines();

                // Sort by order_nr and filter active ones
                const activePipelines = fetchedPipelines
                    .filter(p => p.active)
                    .sort((a, b) => a.order_nr - b.order_nr);

                setPipelines(activePipelines);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar pipelines');
            } finally {
                setLoading(false);
            }
        };

        fetchPipelines();
    }, [token]);

    const handleSelectPipeline = (pipeline: Pipeline) => {
        setPipeline(pipeline.id, pipeline.name);
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/5 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] flex flex-col">
                <div className="text-center mb-10 shrink-0 relative">
                    <div className="absolute top-0 right-0 flex gap-2">
                        <button
                            onClick={resetPipelineAndRole}
                            className="text-xs text-gray-400 hover:text-white font-medium px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Trocar de Função
                        </button>
                    </div>

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-white/10 mb-6 shadow-2xl">
                        <LayoutDashboard className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Qual pipeline queres analisar?</h1>
                    <p className="text-gray-400">
                        A entrar como <span className="text-white font-medium capitalize">{role === 'manager' ? 'Diretor' : 'Vendedor'}</span>
                    </p>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-medium">A carregar os teus pipelines do Pipedrive...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
                            <p className="text-red-400 font-medium mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-white font-medium underline text-sm hover:text-red-300 transition-colors">
                                Tentar novamente
                            </button>
                        </div>
                    ) : pipelines.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
                            Não foram encontrados pipelines ativos na tua conta.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pipelines.map((pipeline) => (
                                <button
                                    key={pipeline.id}
                                    onClick={() => handleSelectPipeline(pipeline)}
                                    className="w-full group flex items-center justify-between p-5 rounded-2xl bg-[#121214] border border-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all text-gray-500 shadow-inner">
                                            <LayoutDashboard className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{pipeline.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium">Pipeline #{pipeline.id} no Pipedrive</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-600 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
