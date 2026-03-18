"use client";

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { PipedriveAPI } from '@/lib/pipedrive';
import { Activity, PipedriveUser } from '@/types/pipedrive';
import {
    X, Phone, Mail, Users, CheckSquare, Clock,
    CalendarCheck, CalendarPlus, Loader2,
    ExternalLink, FileText, CheckCircle2,
    AlertTriangle, Building2, MessageCircle,
} from 'lucide-react';

// ─── Tipos ───────────────────────────────────────────────────────────────────

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
        personPhone?: string;
        personEmail?: string;
        lastNote?: string;
        ownerName?: string;
        ownerId?: number;
    };
}

type ModalData = ActivityModalData | DealModalData;

interface Props {
    data: ModalData;
    onClose: () => void;
    onActivityRescheduled?: (activityId: number, newDate: string, newTime?: string) => void;
    onActivityDone?: (activityId: number) => void;
    onFollowUpCreated?: (dealId: number, dueDate: string) => void;
    viewUsers?: PipedriveUser[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
            <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {label}
            </p>
            {children}
        </div>
    );
}

// ─── Estilos de input partilhados ────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border:     '1px solid var(--border)',
    color:      'var(--text-primary)',
    outline:    'none',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function DetailModal({ data, onClose, onActivityRescheduled, onActivityDone, onFollowUpCreated, viewUsers }: Props) {
    const token = useAppStore(s => s.token);

    const todayStr    = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [showReschedule, setShowReschedule] = useState(false);
    const [newDate, setNewDate]               = useState(tomorrowStr);
    const [newTime, setNewTime]               = useState('09:00');

    const [showFollowUp, setShowFollowUp]     = useState(false);
    const [followUpType, setFollowUpType]     = useState('call');
    const [followUpDate, setFollowUpDate]     = useState(tomorrowStr);
    const [followUpTime, setFollowUpTime]     = useState('09:00');
    const [followUpNote, setFollowUpNote]     = useState('');
    const [assignToUserId, setAssignToUserId] = useState<number | null>(
        data.mode === 'deal' && data.deal.ownerId ? data.deal.ownerId : null
    );

    const [saving, setSaving] = useState(false);
    const [saved, setSaved]   = useState(false);
    const [error, setError]   = useState('');

    const handleReschedule = async () => {
        if (data.mode !== 'activity' || !token || !newDate) return;
        setSaving(true); setError('');
        try {
            await new PipedriveAPI(token).updateActivity(data.activity.id, { due_date: newDate, due_time: newTime || undefined });
            setSaved(true);
            setTimeout(() => { onActivityRescheduled?.(data.activity.id, newDate, newTime); onClose(); }, 700);
        } catch (e: any) { setError(e.message || 'Erro ao remarcar'); setSaving(false); }
    };

    const handleMarkDone = async () => {
        if (data.mode !== 'activity' || !token) return;
        setSaving(true); setError('');
        try {
            await new PipedriveAPI(token).updateActivity(data.activity.id, { done: true });
            setSaved(true);
            setTimeout(() => { onActivityDone?.(data.activity.id); onClose(); }, 700);
        } catch (e: any) { setError(e.message || 'Erro ao marcar'); setSaving(false); }
    };

    const handleFollowUp = async () => {
        if (data.mode !== 'deal' || !token || !followUpDate) return;
        const selectedType = ACTIVITY_TYPES.find(t => t.key === followUpType)!;
        setSaving(true); setError('');
        try {
            const payload: any = {
                deal_id: data.deal.id, type: followUpType,
                subject: `${selectedType.label} — ${data.deal.title}`,
                due_date: followUpDate, done: false,
            };
            if (followUpTime)            payload.due_time = followUpTime;
            if (followUpNote.trim())     payload.note     = followUpNote.trim();
            if (assignToUserId !== null) payload.user_id  = assignToUserId;
            await new PipedriveAPI(token).createActivity(payload);
            setSaved(true);
            setTimeout(() => { onFollowUpCreated?.(data.deal.id, followUpDate); onClose(); }, 700);
        } catch (e: any) { setError(e.message || 'Erro ao criar follow-up'); setSaving(false); }
    };

    const isActivity = data.mode === 'activity';
    const cfg  = isActivity ? (ACTIVITY_CONFIG[data.activity.type?.toLowerCase()] || { icon: CheckSquare, label: 'Atividade' }) : null;
    const Icon = cfg?.icon ?? CheckSquare;

    const daysColor = (d: number): string => d >= 30 ? 'var(--rose)' : d >= 14 ? 'var(--orange)' : 'var(--text-secondary)';
    const showAssignField = !isActivity && viewUsers && viewUsers.length > 0;

    // Botão de acção (guardar/confirmar)
    const ActionBtn = ({ onClick, disabled, label, savedLabel }: { onClick: () => void; disabled: boolean; label: React.ReactNode; savedLabel: React.ReactNode }) => (
        <button onClick={onClick} disabled={disabled}
            className="flex-1 py-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 transition-all"
            style={{
                background: saved ? 'rgba(16,185,129,0.15)' : saving ? 'var(--blue-dim)' : 'var(--blue)',
                color:      saved ? 'var(--green)'           : saving ? 'var(--blue)'     : '#fff',
                border:     `1px solid ${saved ? 'rgba(16,185,129,0.3)' : saving ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                opacity:    disabled ? 0.7 : 1,
            }}>
            {saved ? savedLabel : saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A guardar...</> : label}
        </button>
    );

    const CancelBtn = ({ onClick }: { onClick: () => void }) => (
        <button onClick={onClick} className="px-4 py-2.5 rounded-xl text-[11px] font-black transition-colors"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            Cancelar
        </button>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)' }}>

                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-3"
                    style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center mt-0.5"
                            style={{
                                background: isActivity ? 'var(--bg-surface)' : 'rgba(244,63,94,0.08)',
                                border:     `1px solid ${isActivity ? 'var(--border)' : 'rgba(244,63,94,0.2)'}`,
                            }}>
                            <Icon className="w-4 h-4" style={{ color: isActivity ? 'var(--text-secondary)' : 'var(--rose)' }} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-0.5" style={{ color: 'var(--text-muted)' }}>
                                {isActivity ? cfg!.label : `Deal parado · ${data.deal.daysStuck}d`}
                            </p>
                            <h3 className="text-sm font-black leading-snug" style={{ color: 'var(--text-primary)' }}>
                                {isActivity ? data.activity.subject : data.deal.title}
                            </h3>
                            {isActivity && data.activity.deal_title && (
                                <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                                    {data.activity.deal_title}
                                </p>
                            )}
                            {!isActivity && (
                                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {data.deal.stageName}
                                    {data.deal.ownerName && <span className="ml-1.5" style={{ color: 'var(--text-muted)' }}>· {data.deal.ownerName}</span>}
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface)')}>
                        <X className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>

                {/* Corpo */}
                <div className="px-6 py-5 space-y-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                    {/* ── ATIVIDADE ── */}
                    {isActivity && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Section label="Data">
                                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {new Date(data.activity.due_date).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        {data.activity.due_time && <span className="font-medium ml-1.5" style={{ color: 'var(--text-muted)' }}>às {data.activity.due_time.slice(0, 5)}</span>}
                                    </p>
                                </Section>
                                <Section label="Estado">
                                    <p className="text-sm font-bold" style={{ color: data.activity.due_date < todayStr ? 'var(--rose)' : 'var(--orange)' }}>
                                        {data.activity.due_date < todayStr ? 'Atrasada' : 'Para hoje'}
                                    </p>
                                </Section>
                            </div>

                            {data.activity.note && (
                                <Section label="Nota">
                                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{data.activity.note}</p>
                                    </div>
                                </Section>
                            )}

                            {data.activity.deal_id && (
                                <a href={`https://app.pipedrive.com/deal/${data.activity.deal_id}`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[11px] font-bold transition-opacity hover:opacity-70"
                                    style={{ color: 'var(--blue)' }}>
                                    <ExternalLink className="w-3.5 h-3.5" /> Abrir deal no Pipedrive
                                </a>
                            )}

                            {/* Remarcar */}
                            {!showReschedule ? (
                                <button onClick={() => setShowReschedule(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-black transition-all"
                                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-surface)')}>
                                    <CalendarPlus className="w-4 h-4" /> Remarcar para outra data
                                </button>
                            ) : (
                                <div className="space-y-3 p-4 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Nova data</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="date" value={newDate} min={todayStr} onChange={e => setNewDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl text-sm" style={inputStyle} />
                                        <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl text-sm" style={inputStyle} />
                                    </div>
                                    <div className="flex gap-2">
                                        <ActionBtn onClick={handleReschedule} disabled={saving || saved}
                                            label={<><CalendarCheck className="w-3.5 h-3.5" /> Confirmar</>}
                                            savedLabel={<><CalendarCheck className="w-3.5 h-3.5" /> Guardado!</>} />
                                        <CancelBtn onClick={() => setShowReschedule(false)} />
                                    </div>
                                </div>
                            )}

                            {/* Marcar feita */}
                            <button onClick={handleMarkDone} disabled={saving || saved}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-black transition-all"
                                style={{
                                    background: saved ? 'rgba(16,185,129,0.15)' : saving ? 'var(--bg-surface)' : 'var(--green)',
                                    color:      saved ? 'var(--green)' : saving ? 'var(--text-muted)' : '#fff',
                                    border:     `1px solid ${saved ? 'rgba(16,185,129,0.3)' : 'transparent'}`,
                                    opacity:    (saving || saved) ? 0.8 : 1,
                                }}>
                                {saved ? <><CalendarCheck className="w-4 h-4" /> Feito!</>
                                    : saving ? <><Loader2 className="w-4 h-4 animate-spin" /> A guardar...</>
                                        : <><CheckCircle2 className="w-4 h-4" /> Marcar como feita</>}
                            </button>
                        </>
                    )}

                    {/* ── DEAL ── */}
                    {!isActivity && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Section label="Valor">
                                    <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                                        {data.deal.value > 0 ? fmt(data.deal.value) : '—'}
                                    </p>
                                </Section>
                                <Section label="Parado há">
                                    <p className="text-sm font-black" style={{ color: daysColor(data.deal.daysStuck) }}>
                                        {data.deal.daysStuck} dias
                                    </p>
                                </Section>
                                {data.deal.orgName && (
                                    <Section label="Empresa">
                                        <p className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                            <Building2 className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
                                            {data.deal.orgName}
                                        </p>
                                    </Section>
                                )}
                                {data.deal.personName && (
                                    <Section label="Contacto">
                                        <p className="text-[12px] font-bold" style={{ color: 'var(--text-secondary)' }}>{data.deal.personName}</p>
                                    </Section>
                                )}
                            </div>

                            {data.deal.lastNote ? (
                                <Section label="Última nota">
                                    <div className="rounded-xl px-3 py-2.5" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                            <p className="text-[12px] leading-relaxed line-clamp-4" style={{ color: 'var(--text-secondary)' }}>
                                                {data.deal.lastNote}
                                            </p>
                                        </div>
                                    </div>
                                </Section>
                            ) : (
                                <div className="flex items-center gap-2 py-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Sem notas registadas neste deal
                                </div>
                            )}

                            <a href={`https://app.pipedrive.com/deal/${data.deal.id}`} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[11px] font-bold transition-opacity hover:opacity-70"
                                style={{ color: 'var(--blue)' }}>
                                <ExternalLink className="w-3.5 h-3.5" /> Abrir deal completo no Pipedrive
                            </a>

                            {/* ── Ações rápidas de contacto ── */}
                            {(data.deal.personPhone || data.deal.personEmail) && (
                                <div>
                                    <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--text-muted)' }}>Contacto Rápido</p>
                                    <div className="grid grid-cols-3 gap-2">

                                        {/* 📞 Click-to-Call */}
                                        {data.deal.personPhone ? (
                                            <a
                                                href={`tel:${data.deal.personPhone.replace(/\s/g, '')}`}
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black transition-all hover:opacity-80 active:scale-95"
                                                style={{ background: 'rgba(34,197,94,0.10)', color: 'rgb(74,222,128)', border: '1px solid rgba(34,197,94,0.2)' }}
                                                title={data.deal.personPhone}
                                            >
                                                <Phone className="w-4 h-4" />
                                                Ligar
                                            </a>
                                        ) : (
                                            <div
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black cursor-not-allowed"
                                                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', opacity: 0.4 }}
                                                title="Sem número registado no Pipedrive"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Ligar
                                            </div>
                                        )}

                                        {/* ✉️ Click-to-Email */}
                                        {data.deal.personEmail ? (
                                            <a
                                                href={`mailto:${data.deal.personEmail}?subject=Follow-up%3A%20${encodeURIComponent(data.deal.title)}`}
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black transition-all hover:opacity-80 active:scale-95"
                                                style={{ background: 'rgba(59,130,246,0.10)', color: 'rgb(96,165,250)', border: '1px solid rgba(59,130,246,0.2)' }}
                                                title={data.deal.personEmail}
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </a>
                                        ) : (
                                            <div
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black cursor-not-allowed"
                                                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', opacity: 0.4 }}
                                                title="Sem email registado no Pipedrive"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </div>
                                        )}

                                        {/* 💬 WhatsApp Direct */}
                                        {data.deal.personPhone ? (
                                            <a
                                                href={`https://wa.me/${data.deal.personPhone.replace(/[^\d+]/g, '').replace(/^00/, '+')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black transition-all hover:opacity-80 active:scale-95"
                                                style={{ background: 'rgba(37,211,102,0.10)', color: 'rgb(74,222,128)', border: '1px solid rgba(37,211,102,0.2)' }}
                                                title={`WhatsApp: ${data.deal.personPhone}`}
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                WhatsApp
                                            </a>
                                        ) : (
                                            <div
                                                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-[10px] font-black cursor-not-allowed"
                                                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)', opacity: 0.4 }}
                                                title="Sem número para WhatsApp"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                WhatsApp
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                            {/* Follow-up */}
                            {!showFollowUp ? (
                                <button onClick={() => setShowFollowUp(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-black transition-opacity hover:opacity-80"
                                    style={{ background: 'var(--blue)', color: '#fff' }}>
                                    <CalendarPlus className="w-4 h-4" /> Agendar follow-up
                                </button>
                            ) : (
                                <div className="space-y-4 p-4 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Follow-up</p>

                                    {/* Tipo */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {ACTIVITY_TYPES.map(t => {
                                            const TIcon = t.icon;
                                            const active = followUpType === t.key;
                                            return (
                                                <button key={t.key} onClick={() => setFollowUpType(t.key)}
                                                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-black transition-all"
                                                    style={{
                                                        background: active ? 'var(--blue-dim)' : 'var(--bg-hover)',
                                                        color:      active ? 'var(--blue)' : 'var(--text-muted)',
                                                        border:     `1px solid ${active ? 'rgba(59,130,246,0.3)' : 'var(--border)'}`,
                                                    }}>
                                                    <TIcon className="w-3.5 h-3.5" />{t.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Data + hora */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="date" value={followUpDate} min={todayStr} onChange={e => setFollowUpDate(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl text-sm" style={inputStyle} />
                                        <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl text-sm" style={inputStyle} />
                                    </div>

                                    {/* Atribuir a */}
                                    {showAssignField && (
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Atribuir a</p>
                                            <select value={assignToUserId ?? ''} onChange={e => setAssignToUserId(e.target.value ? Number(e.target.value) : null)}
                                                className="w-full px-3 py-2 rounded-xl text-sm" style={inputStyle}>
                                                <option value="">Não atribuir</option>
                                                {viewUsers!.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {/* Nota */}
                                    <textarea value={followUpNote} onChange={e => setFollowUpNote(e.target.value)}
                                        placeholder="Nota opcional..." rows={2}
                                        className="w-full px-3 py-2 rounded-xl text-sm resize-none"
                                        style={{ ...inputStyle, color: 'var(--text-primary)' }} />

                                    <div className="flex gap-2">
                                        <ActionBtn onClick={handleFollowUp} disabled={saving || saved}
                                            label={<><CalendarPlus className="w-3.5 h-3.5" /> Confirmar</>}
                                            savedLabel={<><CalendarCheck className="w-3.5 h-3.5" /> Guardado!</>} />
                                        <CancelBtn onClick={() => setShowFollowUp(false)} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {error && (
                        <p className="text-[11px] rounded-xl px-3 py-2"
                            style={{ color: 'var(--rose)', background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
