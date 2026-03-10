import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Role, PipedriveUser } from '@/types/pipedrive';

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Initial state
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
            startDate: null,
            endDate: null,
            dashboardSettings: {
                showPipelineValue: true,
                showWinRate: true,
                showLeaderboard: true,
                defaultModule: 'activities',
            },

            // Actions
            setToken: (token: string) =>
                set({ token }),

            setUserParams: (userId: number, userName: string, isAdmin: boolean) =>
                set({
                    userId,
                    userName,
                    isAdmin,
                }),

            setRole: (role: Role) =>
                set({ role }),

            setPipeline: (pipelineId: number, pipelineName: string) =>
                set({
                    selectedPipelineId: pipelineId,
                    selectedPipelineName: pipelineName
                }),

            setWebhookUrl: (url: string) =>
                set({ webhookUrl: url }),

            setViewUsers: (users: PipedriveUser[]) =>
                set({ viewUsers: users }),

            setSelectedUserId: (userId: number | null) =>
                set({ selectedUserId: userId }),

            setStartDate: (date: string | null) =>
                set({ startDate: date }),

            setEndDate: (date: string | null) =>
                set({ endDate: date }),

            updateDashboardSettings: (settings: Partial<AppState['dashboardSettings']>) =>
                set((state) => ({
                    dashboardSettings: { ...state.dashboardSettings, ...settings }
                })),

            resetPipelineAndRole: () =>
                set({
                    role: null,
                    selectedPipelineId: null,
                    selectedPipelineName: null
                }),

            logout: () =>
                set({
                    token: null,
                    role: null,
                    userId: null,
                    userName: null,
                    isAdmin: false,
                    selectedPipelineId: null,
                    selectedPipelineName: null,
                }),
        }),
        {
            name: 'pipedrive-kpi-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
