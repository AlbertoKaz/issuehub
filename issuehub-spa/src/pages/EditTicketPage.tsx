import {type FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/tickets';
import type { Ticket } from '../types/ticket';

export default function EditTicketPage() {
    const params = useParams();
    const ticketId = Number(params.id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [errorMessage, setErrorMessage] = useState('');

    const { data, isLoading, isError, error } = useQuery<Ticket>({
        queryKey: ['ticket', ticketId],
        queryFn: () => getTicket(ticketId),
        enabled: Number.isInteger(ticketId) && ticketId > 0,
    });

    useEffect(() => {
        if (data) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(data.title);
            setDescription(data.description);
            setStatus(data.status);
            setPriority(data.priority || 'medium');
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: () =>
            updateTicket(ticketId, {
                title,
                description,
                status,
                priority,
            }),
        onSuccess: async (updatedTicket) => {
            setErrorMessage('');
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
            await queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            await queryClient.invalidateQueries({ queryKey: ['dashboard-recent-tickets'] });

            navigate(`/tickets/${updatedTicket.id}`);
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message || 'No se pudo actualizar el ticket.'
                );
            } else {
                setErrorMessage('Ha ocurrido un error inesperado.');
            }
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage('');
        mutation.mutate();
    }

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Edit ticket</h1>
                <p className="mt-4 text-sm text-gray-600">Cargando ticket...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Edit ticket</h1>
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
                <h1 className="text-3xl font-bold">Edit ticket</h1>
                <p className="mt-4 text-sm text-gray-600">No se encontró el ticket.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to={`/tickets/${ticketId}`}
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                    ← Back to ticket
                </Link>
            </div>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                        Update Ticket
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Edit ticket
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                        Modifica el contenido del ticket y actualiza su estado o prioridad.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="min-h-40 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                            >
                                <option value="open">Open</option>
                                <option value="in_progress">In progress</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                            >
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(event) => setPriority(event.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/tickets/${ticketId}`)}
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}