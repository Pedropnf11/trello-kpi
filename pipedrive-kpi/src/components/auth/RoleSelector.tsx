"use client";

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Role } from '@/types/pipedrive';
import { Shield, Users, Loader2 } from 'lucide-react';

export default function RoleSelector() {
    const setRole = useAppStore(state => state.setRole);
    const isAdmin = useAppStore(state => state.isAdmin);
    const userName = useAppStore(state => state.userName);

    // Não-admins vão direto para sales sem ver este ecrã
    useEffect(() => {
        if (!isAdmin) {
            setRole('sales');
        }
    }, [isAdmin, setRole]);

    // Enquanto redireciona, mostra spinner
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-500 text-sm">A preparar o teu dashboard...</p>
            </div>
        );
    }

    const handleSelectRole = (selectedRole: Role) => {
        setRole(selectedRole);
    };

    return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Bem-vindo, {userName?.split(' ')[0] || 'Utilizador'}
                    </h1>
                    <p className="text-xl text-gray-400">
                        Como deseja aceder ao Pipedrive hoje?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Manager Role Card — só admins chegam aqui */}
                    <button
                        onClick={() => handleSelectRole('manager')}
                        className="group text-left p-8 rounded-3xl transition-all duration-300 relative overflow-hidden border bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white">
                                <Shield className="w-7 h-7" />
                            </div>

                            <h2 className="text-2xl font-bold mb-3 text-white">Diretor Comercial</h2>
                            <p className="text-gray-400 leading-relaxed flex-1">
                                Visão 360º da tua operação comercial. Acompanha objetivos, pipelines, deal rotting e a performance completa de toda a equipa de vendas.
                            </p>
                        </div>
                    </button>

                    {/* Sales Role Card */}
                    <button
                        onClick={() => handleSelectRole('sales')}
                        className="group text-left p-8 rounded-3xl transition-all duration-300 relative overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer flex flex-col h-full min-h-[300px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-800 text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Users className="w-7 h-7" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">Vendedor</h2>
                            <p className="text-gray-400 leading-relaxed flex-1">
                                Focado apenas nos teus negócios e comissões. Acompanha as tuas metas pessoais, analisa o teu funil e acede à lista de tarefas estruturada para o teu dia.
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
