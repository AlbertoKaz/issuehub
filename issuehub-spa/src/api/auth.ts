import api from './client';

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', payload);
    return response.data;
}

export async function getMe() {
    const response = await api.get('/me');
    return response.data;
}