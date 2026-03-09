import { PipedriveUser, Pipeline, Stage, Deal, Activity } from '@/types/pipedrive';

const API_BASE_URL = 'https://api.pipedrive.com/v1';

export class PipedriveAPI {
    private token: string;

    constructor(token: string) {
        if (!token) throw new Error('API Token is required');
        this.token = token;
    }

    private async fetch<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        url.searchParams.append('api_token', this.token);

        // Append extra params
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('API Token inválido');
            }
            throw new Error(`Pipedrive API Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch data from Pipedrive');
        }

        return data.data;
    }

    // 1. Verify token and get current user details
    async getCurrentUser(): Promise<PipedriveUser> {
        return this.fetch<PipedriveUser>('/users/me');
    }

    // 2. Get all pipelines
    async getPipelines(): Promise<Pipeline[]> {
        return this.fetch<Pipeline[]>('/pipelines');
    }

    // 3. Get stages for a specific pipeline
    async getStages(pipelineId: number): Promise<Stage[]> {
        return this.fetch<Stage[]>('/stages', { pipeline_id: pipelineId });
    }

    // 4. Get active users in the company
    async getUsers(): Promise<PipedriveUser[]> {
        const users = await this.fetch<PipedriveUser[]>('/users');
        return users.filter(u => u.active_flag);
    }

    // 5. Get all deals for a specific pipeline (handles pagination)
    async getDeals(pipelineId: number, status: 'all_not_deleted' | 'open' | 'won' | 'lost' = 'all_not_deleted'): Promise<Deal[]> {
        let allDeals: Deal[] = [];
        let start = 0;
        const limit = 500; // Max allowed by Pipedrive
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`${API_BASE_URL}/deals?api_token=${this.token}&pipeline_id=${pipelineId}&status=${status}&start=${start}&limit=${limit}`);

            if (!response.ok) throw new Error('Failed to fetch deals');

            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            if (data.data) {
                allDeals = [...allDeals, ...data.data];
            }

            hasMore = data.additional_data?.pagination?.more_items_in_collection || false;
            start = data.additional_data?.pagination?.next_start;
        }

        return allDeals;
    }

    // 6. Get activities (recent and upcoming)
    async getActivities(userId?: number): Promise<Activity[]> {
        const params: Record<string, string | number> = {
            limit: 500,
            user_id: userId || 0 // 0 means all users if admin
        };
        return this.fetch<Activity[]>('/activities', params);
    }

    // 7. Get notes (comments)
    async getNotes(userId?: number): Promise<any[]> {
        const params: Record<string, string | number> = {
            limit: 500,
            user_id: userId || 0
        };
        return this.fetch<any[]>('/notes', params);
    }

    // 8. Get all deals across all pipelines
    async getAllDeals(status: string = 'all_not_deleted'): Promise<Deal[]> {
        let allDeals: Deal[] = [];
        let start = 0;
        const limit = 500;
        let hasMore = true;

        while (hasMore) {
            const response = await fetch(`${API_BASE_URL}/deals?api_token=${this.token}&status=${status}&start=${start}&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch all deals');
            const data = await response.json();
            if (!data.success) throw new Error(data.error);

            if (data.data) {
                allDeals = [...allDeals, ...data.data];
            }

            hasMore = data.additional_data?.pagination?.more_items_in_collection || false;
            start = data.additional_data?.pagination?.next_start;
        }

        return allDeals;
    }
}
