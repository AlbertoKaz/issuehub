import api from './client';
import type { PaginatedTicketsResponse, Ticket } from '../types/ticket';

type TicketResponse = {
    data?: Ticket;
};

export type CreateTicketPayload = {
    title: string;
    description: string;
};

export type UpdateTicketStatusPayload = {
    status: string;
};

export type GetTicketsParams = {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
};

export type UpdateTicketPayload = {
    title: string;
    description: string;
    status: string;
    priority: string;
};

export async function getTickets(
    params?: GetTicketsParams
): Promise<PaginatedTicketsResponse> {
    const response = await api.get<PaginatedTicketsResponse>('/tickets', {
        params,
    });

    return response.data;
}

export async function getTicket(id: number): Promise<Ticket> {
    const response = await api.get<Ticket | TicketResponse>(`/tickets/${id}`);

    if ('id' in response.data) {
        return response.data;
    }

    if (response.data.data) {
        return response.data.data;
    }

    throw new Error('Ticket no encontrado.');
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
    const response = await api.post<Ticket>('/tickets', payload);
    return response.data;
}

export async function updateTicketStatus(
    id: number,
    payload: UpdateTicketStatusPayload
): Promise<Ticket> {
    const response = await api.patch<Ticket | TicketResponse>(`/tickets/${id}`, payload);

    if ('id' in response.data) {
        return response.data;
    }

    if (response.data.data) {
        return response.data.data;
    }

    throw new Error('No se pudo actualizar el ticket.');
}

export async function updateTicket(
    id: number,
    payload: UpdateTicketPayload
): Promise<Ticket> {
    const response = await api.patch<Ticket | TicketResponse>(`/tickets/${id}`, payload);

    if ('id' in response.data) {
        return response.data;
    }

    if (response.data.data) {
        return response.data.data;
    }

    throw new Error('No se pudo actualizar el ticket.');
}

export async function deleteTicket(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/tickets/${id}`);
    return response.data;
}
