import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Role, PipedriveUser } from '@/types/pipedrive';

const getDefaultStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
};

const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0];
};

// Extendemos AppState localmente para os novos campos de salesDashboardSettings
type ExtendedSalesDashboardSettings = {
    showFunnel: boolean;
    showFocusZone: boolean;
    showActivityTimeline: boolean;
    showActivitiesTable: boolean;
    showPerformanceTable: boolean;
    // Novos toggles de KPI cards
    showClosedRevenue: boolean;
    showWinRate: boolean;
    showPipelineOpen: boolean;
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            userId: null,
            userName: null,
            isAdmin: false,
            selectedPipelineId: null,
            selectedPipelineName: null,
            webhookUrl: '',
            viewUsers: [],
            selectedUserId: null,
            // Default: última semana
            startDate: getDefaultStartDate(),
            endDate: getDefaultEndDate(),

            // Manager dashboard settings
            dashboardSettings: {
                showPipelineValue: true,
                showWinRate: true,
                showLeaderboard: true,
                defaultModule: 'activities',
            },

            // Sales dashboard settings
            salesDashboardSettings: {
                showFunnel: true,
                showFocusZone: true,
                showActivityTimeline: true,
                showActivitiesTable: true,
                showPerformanceTable: false,
                // KPI cards — todos visíveis por defeito
                showClosedRevenue: true,
                showWinRate: true,
                showPipelineOpen: true,
            } as ExtendedSalesDashboardSettings,

            // Actions
            setToken: (token) => set({ token }),
            setUserParams: (userId, userName, isAdmin) => set({ userId, userName, isAdmin }),
            setRole: (role) => set({ role }),
            setPipeline: (pipelineId, pipelineName) => set({ selectedPipelineId: pipelineId, selectedPipelineName: pipelineName }),
            setWebhookUrl: (url) => set({ webhookUrl: url }),
            setViewUsers: (users) => set({ viewUsers: users }),
            setSelectedUserId: (userId) => set({ selectedUserId: userId }),
            setStartDate: (date) => set({ startDate: date }),
            setEndDate: (date) => set({ endDate: date }),

            updateDashboardSettings: (settings) =>
                set((state) => ({ dashboardSettings: { ...state.dashboardSettings, ...settings } })),

            updateSalesDashboardSettings: (settings) =>
                set((state) => ({ salesDashboardSettings: { ...state.salesDashboardSettings, ...settings } })),

            resetPipelineAndRole: () =>
                set({ role: null, selectedPipelineId: null, selectedPipelineName: null }),

            logout: () =>
                set({
                    token: null, role: null, userId: null, userName: null, isAdmin: false,
                    selectedPipelineId: null, selectedPipelineName: null,
                    startDate: getDefaultStartDate(), endDate: getDefaultEndDate(),
                }),
        }),
        {
            name: 'pipedrive-kpi-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
