"use client";

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Activity } from '@/types/pipedrive';
import {
    X, Phone, Mail, Users, CheckSquare, Clock,
    CalendarCheck, CalendarPlus, Loader2,
    ExternalLink, FileText, CheckCircle2,
    Tag, AlertTriangle, Building2,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Tipos de entrada — modo Atividade ou modo Deal
// ─────────────────────────────────────────────

export interface ActivityModalData {
    mode: 'activity';
    activity: Activity;
}

export interface DealModalData {
    mode: 'deal';
    deal: {
        id: number;
        title: string;
        value: number;
        stageName: string;
        daysStuck: number;
        orgName?: string;
        personName?: string;
        lastNote?: string;
    };
}

type ModalData = ActivityModalData | DealModalData;

interface Props {
    data: ModalData;
    onClose: () => void;
    // Callbacks para actualizar o pai sem re-fetch
    onActivityRescheduled?: (activityId: number, newDate: string, newTime?: string) => void;
    onActivityDone?: (activityId: number) => void;
    onFollowUpCreated?: (dealId: number, dueDate: string) => void;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const ACTIVITY_TYPES = [
    { key: 'call',    label: 'Chamada',  icon: Phone       },
    { key: 'email',   label: 'Email',    icon: Mail        },
    { key: 'meeting', label: 'Reunião',  icon: Users       },
    { key: 'task',    label: 'Tarefa',   icon: CheckSquare },
];

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; label: string }> = {
    call:     { icon: Phone,       label: 'Chamada'  },
    email:    { icon: Mail,        label: 'Email'    },
    meeting:  { icon: Users,       label: 'Reunião'  },
    task:     { icon: CheckSquare, label: 'Tarefa'   },
    deadline: { icon: Clock,       label: 'Prazo'    },
};

const fmt = (v: number) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.18em] mb-1.5">{label}</p>
            {children}
        </div>
    );
}

// ─────────────────────────────────────────────
// Modal principal
// ─────────────────────────────────────────────

export default function DetailModal({ data, onClose, onActivityRescheduled, onActivityDone, onFollowUpCreated }: Props) {
    const token = useAppStore(s => s.token);

    const todayStr    = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Modo reschedule (partilhado entre os dois modos)
    const [showReschedule, setShowReschedule] = useState(false);
    const [newDate, setNewDate]               = useState(tomorrowStr);
    const [newTime, setNewTime]               = useState('09:00');

    // Modo follow-up (só deal)
    const [showFollowUp, setShowFollowUp]     = useState(false);
    const [followUpType, setFollowUpType]     = useState('call');
    const [followUpDate, setFollowUpDate]     = useState(tomorrowStr);
    const [followUpTime, setFollowUpTime]     = useState('09:00');
    const [followUpNote, setFollowUpNote]     = useState('');

    const [saving, setSaving]   = useState(false);
    const [saved, setSaved]     = useState(false);
    const [error, setError]     = useState('');

    // ── Acções de atividade ──
    const handleReschedule = async () => {
        if (data.mode !== 'activity' || !token || !newDate) return;
        setSaving(true); setError('');
        try {
            await new PipedriveAPI(token).updateActivity(data.activity.id, {
                due_date: newDate,
                due_time: newTime || undefined,
            });
            setSaved(true);
            setTimeout(() => {
                onActivityRescheduled?.(data.activity.id, newDate, newTime);
                onClose();
            }, 700);
        } catch (e: any) {
            setError(e.message || 'Erro ao remarcar');
            setSaving(false);
        }
    };

    const handleMarkDone = async () => {
        if (data.mode !== 'activity' || !token) return;
        setSaving(true); setError('');
        try {
            await new PipedriveAPI(token).updateActivity(data.activity.id, { done: true });
            setSaved(true);
            setTimeout(() => {
                onActivityDone?.(data.activity.id);
                onClose();
            }, 700);
        } catch (e: any) {
            setError(e.message || 'Erro ao marcar como feita');
            setSaving(false);
        }
    };

    // ── Acção de follow-up (deal) ──
    const handleFollowUp = async () => {
        if (data.mode !== 'deal' || !token || !followUpDate) return;
        const selectedType = ACTIVITY_TYPES.find(t => t.key === followUpType)!;
        setSaving(true); setError('');
        try {
            await new PipedriveAPI(token).createActivity({
                deal_id: data.deal.id,
                type: followUpType,
                subject: `${selectedType.label} — ${data.deal.title}`,
                due_date: followUpDate,
                due_time: followUpTime || undefined,
                note: followUpNote.trim() || undefined,
                done: false,
            });
            setSaved(true);
            setTimeout(() => {
                onFollowUpCreated?.(data.deal.id, followUpDate);
                onClose();
            }, 700);
        } catch (e: any) {
            setError(e.message || 'Erro ao criar follow-up');
            setSaving(false);
        }
    };

    const isActivity = data.mode === 'activity';
    const cfg = isActivity ? (ACTIVITY_CONFIG[data.activity.type?.toLowerCase()] || { icon: CheckSquare, label: 'Atividade' }) : null;
    const Icon = cfg?.icon ?? CheckSquare;

    const daysColor = (d: number) => d >= 30 ? 'text-rose-400' : d >= 14 ? 'text-yellow-400' : 'text-gray-400';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#0d0f13] border border-white/[0.10] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        {/* Ícone */}
                        <div className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center mt-0.5 ${
                            isActivity
                                ? 'bg-white/[0.04] border-white/[0.08]'
                                : 'bg-rose-500/8 border-rose-500/15'
                        }`}>
                            <Icon className={`w-4 h-4 ${isActivity ? 'text-gray-400' : 'text-rose-400'}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-0.5">
                                {isActivity ? cfg!.label : `Deal parado · ${data.deal.daysStuck}d`}
                            </p>
                            <h3 className="text-sm font-black text-white leading-snug">
                                {isActivity ? data.activity.subject : data.deal.title}
                            </h3>
                            {isActivity && data.activity.deal_title && (
                                <p className="text-[10px] text-gray-600 mt-0.5 truncate">
                                    {data.activity.deal_title}
                                </p>
                            )}
                            {!isActivity && (
                                <p className="text-[10px] text-gray-600 mt-0.5">{data.deal.stageName}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="shrink-0 w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] flex items-center justify-center transition-colors"
                    >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                </div>

                {/* ── Corpo ── */}
                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

                    {/* ──── MODO ATIVIDADE ──── */}
                    {isActivity && (
                        <>
                            {/* Info da atividade */}
                            <div className="grid grid-cols-2 gap-3">
                                <Section label="Data">
                                    <p className="text-sm font-bold text-white">
                                        {new Date(data.activity.due_date).toLocaleDateString('pt-PT', {
                                            weekday: 'short', day: 'numeric', month: 'short'
                                        })}
                                        {data.activity.due_time && (
                                            <span className="text-gray-500 font-medium ml-1.5">
                                                às {data.activity.due_time.slice(0, 5)}
                                            </span>
                                        )}
                                    </p>
                                </Section>
                                <Section label="Estado">
                                    <p className={`text-sm font-bold ${
                                        data.activity.due_date < todayStr ? 'text-rose-400' : 'text-yellow-400'
                                    }`}>
                                        {data.activity.due_date < todayStr ? 'Atrasada' : 'Para hoje'}
                                    </p>
                                </Section>
                            </div>

                            {/* Nota da atividade */}
                            {data.activity.note && (
                                <Section label="Nota">
                                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                                        <p className="text-[12px] text-gray-300 leading-relaxed">
                                            {data.activity.note}
                                        </p>
                                    </div>
                                </Section>
                            )}

                            {/* Link para deal */}
                            {data.activity.deal_id && (
                                <a
                                    href={`https://app.pipedrive.com/deal/${data.activity.deal_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Abrir deal no Pipedrive
                                </a>
                            )}

                            {/* ── Remarcar ── */}
                            {!showReschedule ? (
                                <button
                                    onClick={() => setShowReschedule(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[12px] font-black text-gray-400 hover:bg-white/[0.06] hover:text-white transition-all"
                                >
                                    <CalendarPlus className="w-4 h-4" />
                                    Remarcar para outra data
                                </button>
                            ) : (
                                <div className="space-y-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nova data</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            value={newDate}
                                            min={todayStr}
                                            onChange={e => setNewDate(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={e => setNewTime(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleReschedule}
                                            disabled={saving || saved}
                                            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
                                                saved ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                                                    : saving ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                            }`}
                                        >
                                            {saved ? <><CalendarCheck className="w-3.5 h-3.5" /> Guardado!</>
                                                : saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A guardar...</>
                                                    : <><CalendarCheck className="w-3.5 h-3.5" /> Confirmar</>}
                                        </button>
                                        <button
                                            onClick={() => setShowReschedule(false)}
                                            className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[11px] font-black text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Marcar como feita ── */}
                            <button
                                onClick={handleMarkDone}
                                disabled={saving || saved}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-black transition-all ${
                                    saved ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                                        : saving ? 'bg-white/[0.04] border border-white/[0.06] text-gray-500'
                                            : 'bg-green-600 hover:bg-green-500 text-white'
                                }`}
                            >
                                {saved ? <><CalendarCheck className="w-4 h-4" /> Feito!</>
                                    : saving ? <><Loader2 className="w-4 h-4 animate-spin" /> A guardar...</>
                                        : <><CheckCircle2 className="w-4 h-4" /> Marcar como feita</>}
                            </button>
                        </>
                    )}

                    {/* ──── MODO DEAL ──── */}
                    {!isActivity && (
                        <>
                            {/* Info do deal */}
                            <div className="grid grid-cols-2 gap-3">
                                <Section label="Valor">
                                    <p className="text-sm font-black text-white">
                                        {data.deal.value > 0 ? fmt(data.deal.value) : '—'}
                                    </p>
                                </Section>
                                <Section label="Parado há">
                                    <p className={`text-sm font-black ${daysColor(data.deal.daysStuck)}`}>
                                        {data.deal.daysStuck} dias
                                    </p>
                                </Section>
                                {data.deal.orgName && (
                                    <Section label="Empresa">
                                        <p className="text-[12px] font-bold text-gray-300 flex items-center gap-1.5">
                                            <Building2 className="w-3 h-3 text-gray-600 shrink-0" />
                                            {data.deal.orgName}
                                        </p>
                                    </Section>
                                )}
                                {data.deal.personName && (
                                    <Section label="Contacto">
                                        <p className="text-[12px] font-bold text-gray-300">
                                            {data.deal.personName}
                                        </p>
                                    </Section>
                                )}
                            </div>

                            {/* Última nota */}
                            {data.deal.lastNote ? (
                                <Section label="Última nota">
                                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                                            <p className="text-[12px] text-gray-300 leading-relaxed line-clamp-4">
                                                {data.deal.lastNote}
                                            </p>
                                        </div>
                                    </div>
                                </Section>
                            ) : (
                                <div className="flex items-center gap-2 text-[11px] text-gray-600 py-1">
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                    Sem notas registadas neste deal
                                </div>
                            )}

                            {/* Link para o deal */}
                            <a
                                href={`https://app.pipedrive.com/deal/${data.deal.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Abrir deal completo no Pipedrive
                            </a>

                            {/* ── Follow-up ── */}
                            {!showFollowUp ? (
                                <button
                                    onClick={() => setShowFollowUp(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-black transition-all"
                                >
                                    <CalendarPlus className="w-4 h-4" />
                                    Agendar follow-up
                                </button>
                            ) : (
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Follow-up</p>

                                    {/* Tipo */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {ACTIVITY_TYPES.map(t => {
                                            const TIcon = t.icon;
                                            return (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setFollowUpType(t.key)}
                                                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-[10px] font-black transition-all ${
                                                        followUpType === t.key
                                                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                                                            : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-gray-300'
                                                    }`}
                                                >
                                                    <TIcon className="w-3.5 h-3.5" />
                                                    {t.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Data + hora */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            value={followUpDate}
                                            min={todayStr}
                                            onChange={e => setFollowUpDate(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                        <input
                                            type="time"
                                            value={followUpTime}
                                            onChange={e => setFollowUpTime(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>

                                    {/* Nota */}
                                    <textarea
                                        value={followUpNote}
                                        onChange={e => setFollowUpNote(e.target.value)}
                                        placeholder="Nota opcional..."
                                        rows={2}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleFollowUp}
                                            disabled={saving || saved}
                                            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
                                                saved ? 'bg-green-600/20 border border-green-500/30 text-green-400'
                                                    : saving ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                                                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                                            }`}
                                        >
                                            {saved ? <><CalendarCheck className="w-3.5 h-3.5" /> Guardado!</>
                                                : saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A guardar...</>
                                                    : <><CalendarPlus className="w-3.5 h-3.5" /> Confirmar</>}
                                        </button>
                                        <button
                                            onClick={() => setShowFollowUp(false)}
                                            className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[11px] font-black text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Erro global */}
                    {error && (
                        <p className="text-[11px] text-rose-400 bg-rose-500/8 border border-rose-500/15 rounded-xl px-3 py-2">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
