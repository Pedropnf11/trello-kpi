// =============================================
// PIPEDRIVE API TYPES
// =============================================

export interface PipedriveUser {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    active_flag: boolean;
}

export interface Pipeline {
    id: number;
    name: string;
    active: boolean;
    order_nr: number;
    deal_probability: boolean;
}

export interface Stage {
    id: number;
    name: string;
    pipeline_id: number;
    order_nr: number;
    deal_probability: number;
    rotten_flag: boolean;
    rotten_days: number | null;
}

export interface Deal {
    id: number;
    title: string;
    value: number;
    currency: string;
    status: 'open' | 'won' | 'lost' | 'deleted';
    stage_id: number;
    pipeline_id: number;
    user_id: { id: number; name: string; email: string };
    person_id: { name: string } | null;
    org_id: { name: string } | null;
    add_time: string;
    update_time: string;
    won_time: string | null;
    lost_time: string | null;
    stage_change_time: string | null;
    lost_reason: string | null;
    expected_close_date: string | null;
    probability: number | null;
    rotten_time: string | null;
    stage_order_nr: number;
    weighted_value: number;
}

export interface Activity {
    id: number;
    type: string;
    subject: string;
    done: boolean;
    due_date: string;
    deal_id: number | null;
    user_id: number;
    person_id: number | null;
    add_time: string;
}

export interface DealSummary {
    totalDeals: number;
    totalValue: number;
    wonDeals: number;
    lostDeals: number;
    winRate: number;
    avgDealValue: number;
    avgDaysToClose: number;
}

export interface VendedorStats {
    userId: number;
    userName: string;
    totalDeals: number;
    totalValue: number;
    wonDeals: number;
    lostDeals: number;
    winRate: number;
    avgDaysToClose: number;
}

export interface StageStats {
    stageId: number;
    stageName: string;
    dealCount: number;
    totalValue: number;
    avgDaysInStage: number;
    conversionRate: number;
}

// =============================================
// APP STORE TYPES
// =============================================

export type Role = 'manager' | 'sales' | null;

export interface AppState {
    token: string | null;
    role: Role;
    userId: number | null;
    userName: string | null;
    isAdmin: boolean;
    selectedPipelineId: number | null;
    selectedPipelineName: string | null;
    webhookUrl: string;
    viewUsers: PipedriveUser[];
    selectedUserId: number | null;
    startDate: string | null;
    endDate: string | null;
    dashboardSettings: {
        showPipelineValue: boolean;
        showWinRate: boolean;
        showLeaderboard: boolean;
        defaultModule: 'leaderboard' | 'activities';
    };

    // Actions
    setToken: (token: string) => void;
    setUserParams: (userId: number, userName: string, isAdmin: boolean) => void;
    setRole: (role: Role) => void;
    setPipeline: (pipelineId: number, pipelineName: string) => void;
    setWebhookUrl: (url: string) => void;
    setViewUsers: (users: PipedriveUser[]) => void;
    setSelectedUserId: (userId: number | null) => void;
    setStartDate: (date: string | null) => void;
    setEndDate: (date: string | null) => void;
    updateDashboardSettings: (settings: Partial<AppState['dashboardSettings']>) => void;
    resetPipelineAndRole: () => void;
    logout: () => void;
}
