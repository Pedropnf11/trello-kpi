"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import LoginScreen from '@/components/auth/LoginScreen';
import RoleSelector from '@/components/auth/RoleSelector';
import PipelineSelector from '@/components/auth/PipelineSelector';
// import ManagerDashboard from '@/components/dashboard/manager/ManagerDashboard';
// import SalesDashboard from '@/components/dashboard/sales/SalesDashboard';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    const token = useAppStore(state => state.token);
    const role = useAppStore(state => state.role);
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);

    // Fix hydration mismatch issues with Zustand persist
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // 4. Has everything -> Redirect to appropriate Dashboard
    useEffect(() => {
        if (isHydrated && token && role && selectedPipelineId) {
            router.push(`/dashboard/${role}`);
        }
    }, [isHydrated, token, role, selectedPipelineId, router]);

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">A carregar dashboard...</p>
            </div>
        );
    }

    // Auth Flow Logic (Order is strict to match Trello KPI)

    // 1. No token -> Show Login
    if (!token) {
        return <LoginScreen />;
    }

    // 2. Has token but no role -> Show Role Selector
    if (!role) {
        return <RoleSelector />;
    }

    // 3. Has role but no pipeline -> Show Pipeline Selector
    if (!selectedPipelineId) {
        return <PipelineSelector />;
    }

    // 4. Has everything -> Show loading while deciding redirect
    if (token && role && selectedPipelineId) {
        return (
            <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 text-sm">A carregar dashboard...</p>
            </div>
        );
    }

    return null;
}
