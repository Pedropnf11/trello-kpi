import { PipedriveUser, Pipeline, Stage, Deal, Activity } from '@/types/pipedrive';

const API_BASE_URL = 'https://api.pipedrive.com/v1';

export class PipedriveAPI {
    private token: string;

    constructor(token: string) {
        if (!token) throw new Error('API Token is required');
        this.token = token;
    }

    private get requestOptions(): RequestInit {
        return {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-token': this.token,
            },
        };
    }

    private async fetch<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
        const url = new URL(`${API_BASE_URL}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
        const response = await globalThis.fetch(url.toString(), this.requestOptions);
        if (!response.ok) {
            if (response.status === 401) throw new Error('API Token inválido');
            throw new Error(`Pipedrive API Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch data from Pipedrive');
        return data.data;
    }

    private async fetchPaginated(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<Deal[]> {
        let allResults: Deal[] = [];
        let start = 0;
        const limit = 500;
        let hasMore = true;
        while (hasMore) {
            const url = new URL(`${API_BASE_URL}${endpoint}`);
            url.searchParams.append('start', String(start));
            url.searchParams.append('limit', String(limit));
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
            const response = await globalThis.fetch(url.toString(), this.requestOptions);
            if (!response.ok) throw new Error(`Pipedrive API Error: ${response.statusText}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.error || 'Failed to fetch paginated data');
            if (data.data) allResults = [...allResults, ...data.data];
            hasMore = data.additional_data?.pagination?.more_items_in_collection || false;
            start = data.additional_data?.pagination?.next_start ?? start + limit;
        }
        return allResults;
    }

    async getCurrentUser(): Promise<PipedriveUser> {
        return this.fetch<PipedriveUser>('/users/me');
    }

    async getPipelines(): Promise<Pipeline[]> {
        return this.fetch<Pipeline[]>('/pipelines');
    }

    async getStages(pipelineId: number): Promise<Stage[]> {
        return this.fetch<Stage[]>('/stages', { pipeline_id: pipelineId });
    }

    async getUsers(): Promise<PipedriveUser[]> {
        const users = await this.fetch<PipedriveUser[]>('/users');
        return users.filter(u => u.active_flag);
    }

    async getDeals(pipelineId: number, status: 'all_not_deleted' | 'open' | 'won' | 'lost' = 'all_not_deleted'): Promise<Deal[]> {
        return this.fetchPaginated('/deals', { pipeline_id: pipelineId, status });
    }

    async getActivities(userId?: number): Promise<Activity[]> {
        return this.fetch<Activity[]>('/activities', { limit: 500, user_id: userId || 0 });
    }

    async getNotes(userId?: number): Promise<any[]> {
        return this.fetch<any[]>('/notes', { limit: 500, user_id: userId || 0 });
    }

    async getAllDeals(status: string = 'all_not_deleted'): Promise<Deal[]> {
        return this.fetchPaginated('/deals', { status });
    }

    // Cria atividade — token no header, nunca na URL
    async createActivity(payload: {
        deal_id: number;
        type: string;
        subject: string;
        due_date: string;
        due_time?: string;
        note?: string;
        done?: boolean;
    }): Promise<Activity> {
        const response = await globalThis.fetch(`${API_BASE_URL}/activities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-token': this.token,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            if (response.status === 401) throw new Error('API Token inválido');
            throw new Error(`Pipedrive API Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Erro ao criar atividade');
        return data.data;
    }

    // Actualiza atividade existente (remarcar data, marcar como feita, etc.)
    async updateActivity(activityId: number, payload: {
        due_date?: string;
        due_time?: string;
        done?: boolean;
        note?: string;
        subject?: string;
    }): Promise<Activity> {
        const response = await globalThis.fetch(`${API_BASE_URL}/activities/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-api-token': this.token,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            if (response.status === 401) throw new Error('API Token inválido');
            throw new Error(`Pipedrive API Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Erro ao actualizar atividade');
        return data.data;
    }
}
