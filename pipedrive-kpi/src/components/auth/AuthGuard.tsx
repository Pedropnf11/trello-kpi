"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router    = useRouter();
    const pathname  = usePathname();
    const [checked, setChecked] = useState(false);

    const token              = useAppStore(s => s.token);
    const role               = useAppStore(s => s.role);
    const selectedPipelineId = useAppStore(s => s.selectedPipelineId);
    const isAdmin            = useAppStore(s => s.isAdmin);

    useEffect(() => {
        // 1. Sem token → login
        if (!token) {
            router.replace('/');
            return;
        }

        // 2. Sem role ou pipeline → volta ao início
        if (!role || !selectedPipelineId) {
            router.replace('/');
            return;
        }

        // 3. Não-admin a tentar aceder a /dashboard/manager → redireciona para sales
        if (pathname.startsWith('/dashboard/manager') && !isAdmin) {
            router.replace('/dashboard/sales');
            return;
        }

        // 4. Tudo OK
        setChecked(true);
    }, [token, role, selectedPipelineId, isAdmin, pathname, router]);

    if (!checked) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: 'var(--bg-base)' }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--blue)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>A verificar acesso...</p>
            </div>
        );
    }

    return <>{children}</>;
}
