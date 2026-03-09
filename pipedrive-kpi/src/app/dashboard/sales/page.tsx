"use client";

import { useAppStore } from '@/store/appStore';
import Header from '@/components/layout/Header';

export default function SalesDashboard() {
    const selectedPipelineId = useAppStore(state => state.selectedPipelineId);

    return (
        <div className="flex flex-col min-h-screen bg-[#05070a] text-white">
            <Header title="Sales Dashboard" />

            <div className="p-8 flex-1">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4">Sales Dashboard</h1>
                    <p className="text-gray-400">Em construção (Pipeline {selectedPipelineId})</p>
                    {/* Charts and Cards will go here */}
                </div>
            </div>
        </div>
    );
}
