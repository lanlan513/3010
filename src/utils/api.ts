import type { Microbe, MicrobeCategory, Stats, ApiResponse } from '../../shared/types';

const API_BASE = '/api';

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  const data: ApiResponse<T> = await res.json();
  if (!data.success || !data.data) {
    throw new Error(data.error || '请求失败');
  }
  return data.data;
}

export const api = {
  getMicrobes: (params?: { category?: MicrobeCategory; search?: string; habitat?: string; limit?: number; offset?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.habitat) query.set('habitat', params.habitat);
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.offset !== undefined) query.set('offset', String(params.offset));
    const queryStr = query.toString();
    return request<Microbe[]>(`/microbes${queryStr ? `?${queryStr}` : ''}`);
  },

  getMicrobeById: (id: number) => request<Microbe>(`/microbes/${id}`),

  getMicrobesByCategory: (category: MicrobeCategory) => request<Microbe[]>(`/microbes/category/${category}`),

  getRelated: (id: number, limit: number = 4) => request<Microbe[]>(`/microbes/${id}/related?limit=${limit}`),

  getStats: () => request<Stats>('/stats'),
};
