import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface BackendSummary {
    rowCount: number;
    columnCount: number;
    columns: {
        name: string;
        type: string;
        missing: number;
        unique: number;
        stats?: {
            min?: number;
            max?: number;
            mean?: number;
        };
    }[];
    preview: Record<string, unknown>[];
    anomalies?: {
        column: string;
        count: number;
        examples: unknown[];
        reason: string;
    }[];
    ai_kpis?: {
        title: string;
        value_type: string;
        reason: string;
    }[];
}

export const uploadFile = async (file: File): Promise<BackendSummary> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.summary;
};

export const sendChatQuery = async (query: string): Promise<string> => {
    const response = await api.post('/chat', { query });
    return response.data.response;
};

export default api;
