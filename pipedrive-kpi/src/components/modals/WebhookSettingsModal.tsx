"use client";

import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { X, Save, Copy, CheckCircle2 } from "lucide-react";

interface WebhookSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WebhookSettingsModal({ isOpen, onClose }: WebhookSettingsModalProps) {
    const savedUrl = useAppStore(state => state.webhookUrl);
    const setWebhookUrl = useAppStore(state => state.setWebhookUrl);

    const [url, setUrl] = useState(savedUrl || "");
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setWebhookUrl(url);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleCopy = () => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-[#05070a]/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#121214] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">Integração Webhook</h2>
                        <p className="text-sm text-gray-400 mt-1">Configura o endpoint para automações (Ex: Make.com, Zapier)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Webhook URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://hook.make.com/..."
                                className="flex-1 bg-[#0a0a0b] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                            <button
                                onClick={handleCopy}
                                disabled={!url}
                                title="Copiar URL"
                                className="px-4 border border-white/10 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Este webhook será chamado com os dados de performance sempre que atingires um objetivo.
                        </p>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-blue-400 mb-1">Payload de Exemplo</h4>
                        <pre className="text-xs text-gray-400 overflow-x-auto">
                            {`{
  "event": "goal_reached",
  "user_name": "Trello KPI",
  "pipeline_name": "Vendas",
  "deals_won": 12,
  "value": 45000,
  "timestamp": "2026-03-09T17:45:00Z"
}`}
                        </pre>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                        {saved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Guardado
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
