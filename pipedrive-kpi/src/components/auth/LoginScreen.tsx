"use client";

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { KeyRound, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginScreen() {
    const [tokenInput, setTokenInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setToken = useAppStore(state => state.setToken);
    const setUserParams = useAppStore(state => state.setUserParams);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tokenInput.trim()) return;

        setLoading(true);
        setError('');

        try {
            const api = new PipedriveAPI(tokenInput.trim());
            const user = await api.getCurrentUser();

            // Save globally
            setUserParams(user.id, user.name, user.is_admin);
            setToken(tokenInput.trim());

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao validar o token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#05070a] p-4 relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/5 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 md:p-12 max-w-md w-full border border-white/10 text-center relative z-10">
                <div className="mb-10 relative z-10">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                        <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Pipedrive KPI</h1>
                    <p className="text-gray-400 font-medium text-lg">Dashboard de Performance</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8 relative z-10 text-left">
                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded-lg mb-6 text-sm font-medium text-left shadow-sm">
                            <div className="flex items-center gap-2 mb-1 font-bold">
                                Erro de Conexão
                            </div>
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="token" className="block text-sm font-bold text-gray-300 mb-2">
                            Personal API Token
                        </label>
                        <input
                            id="token"
                            type="password"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                            className="w-full p-4 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-white placeholder:text-gray-600 bg-[#121214]"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!tokenInput.trim() || loading}
                        className="group w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-blue-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-4 relative overflow-hidden disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                        ) : (
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Aceder ao Dashboard
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>

                    <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed text-center px-4">
                        A tua chave é mantida apenas no browser para comunicar com o Pipedrive.
                    </p>
                </form>

                <div className="mt-10 pt-6 border-t border-white/10">
                    <a
                        href="https://app.pipedrive.com/settings/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-gray-500 hover:text-white transition flex items-center justify-center gap-1 mx-auto group"
                    >
                        <span>Gerar Token no Pipedrive</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
