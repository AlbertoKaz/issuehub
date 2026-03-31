import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteTicket, getTicket, updateTicketStatus } from '../api/tickets';
import {
    formatStatusLabel,
    getStatusBadgeClasses,
} from '../lib/tickets';
import type { Ticket } from '../types/ticket';

export default function TicketDetailPage() {
    const params = useParams();
    const ticketId = Number(params.id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [errorMessage, setErrorMessage] = useState('');

    const { data, isLoading, isError, error } = useQuery<Ticket>({
        queryKey: ['ticket', ticketId],
        queryFn: () => getTicket(ticketId),
        enabled: Number.isInteger(ticketId) && ticketId > 0,
    });

    const mutation = useMutation({
        mutationFn: (status: string) => updateTicketStatus(ticketId, { status }),
        onSuccess: async () => {
            setErrorMessage('');
            await queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-recent-tickets'] });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || 'No se pudo actualizar el estado.'
                );
            } else {
                setErrorMessage('Ha ocurrido un error inesperado.');
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTicket(ticketId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-recent-tickets'] });
            navigate('/tickets');
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || 'No se pudo eliminar el ticket.'
                );
            } else {
                setErrorMessage('Ha ocurrido un error inesperado.');
            }
        },
    });

    function handleDelete() {
        const confirmed = window.confirm(
            'Are you sure you want to delete this ticket? This action cannot be undone.'
        );

        if (!confirmed) return;

        setErrorMessage('');
        deleteMutation.mutate();
    }

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Ticket detail</h1>
                <p className="mt-4 text-sm text-gray-600">Cargando ticket...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Ticket detail</h1>
                <p className="mt-4 text-sm text-red-600">Error al cargar el ticket.</p>
                <pre className="mt-4 rounded-2xl bg-red-50 p-4 text-xs text-red-700">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Ticket detail</h1>
                <p className="mt-4 text-sm text-gray-600">No se encontró el ticket.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    to="/tickets"
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                    ← Back to tickets
                </Link>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to={`/tickets/${ticketId}/edit`}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Edit ticket
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete ticket'}
                    </button>
                </div>
            </div>

            <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-400">Ticket #{data.id}</p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            {data.title}
                        </h1>
                        <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                            {data.description}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-start">
            <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(data.status)}`}
            >
              {formatStatusLabel(data.status)}
            </span>
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Change status
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => mutation.mutate('open')}
                            disabled={mutation.isPending}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                        >
                            Open
                        </button>

                        <button
                            type="button"
                            onClick={() => mutation.mutate('in_progress')}
                            disabled={mutation.isPending}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                        >
                            In progress
                        </button>

                        <button
                            type="button"
                            onClick={() => mutation.mutate('closed')}
                            disabled={mutation.isPending}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
                        >
                            Closed
                        </button>
                    </div>

                    {mutation.isPending && (
                        <p className="mt-3 text-sm text-gray-500">Updating status...</p>
                    )}

                    {errorMessage && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Created at
                        </p>
                        <p className="mt-2 text-sm text-gray-700">
                            {new Date(data.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Updated at
                        </p>
                        <p className="mt-2 text-sm text-gray-700">
                            {new Date(data.updated_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
}