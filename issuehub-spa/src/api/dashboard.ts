import api from './client';
import type { DashboardStats } from '../types/dashboard';

export async function getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
}
