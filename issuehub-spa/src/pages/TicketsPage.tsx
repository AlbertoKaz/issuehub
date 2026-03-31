import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import type { PaginatedTicketsResponse } from '../types/ticket';
import {
    formatPriorityLabel,
    formatStatusLabel,
    getPriorityBadgeClasses,
    getStatusBadgeClasses,
} from '../lib/tickets';

export default function TicketsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page') || '1');

    const { data, isLoading, isError, error } = useQuery<PaginatedTicketsResponse>({
        queryKey: ['tickets', status, priority, search, page],
        queryFn: () =>
            getTickets({
                status: status || undefined,
                priority: priority || undefined,
                search: search || undefined,
                page,
            }),
    });

    function updateParam(key: string, value: string) {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);

            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }

            newParams.set('page', '1');

            return newParams;
        });
    }

    function goToPage(newPage: number) {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', String(newPage));
            return newParams;
        });
    }

    if (isLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Tickets</h1>
                <p className="mt-4 text-sm text-gray-600">Cargando tickets...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Tickets</h1>
                <p className="mt-4 text-sm text-red-600">Error al cargar tickets.</p>
                <pre className="mt-4 rounded-2xl bg-red-50 p-4 text-xs text-red-700">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
            </div>
        );
    }

    const tickets = data?.data ?? [];
    const meta = data?.meta;

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                            Ticket Management
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Tickets
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                            Busca, filtra y revisa tus incidencias desde una vista clara y rápida.
                        </p>
                    </div>

                    <Link
                        to="/tickets/new"
                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        New Ticket
                    </Link>
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Search
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => updateParam('search', e.target.value)}
                            placeholder="Search tickets by title..."
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => updateParam('status', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                        >
                            <option value="">All statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In progress</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => updateParam('priority', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500"
                        >
                            <option value="">All priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <article
                            key={ticket.id}
                            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                        >
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                                        <span>Ticket #{ticket.id}</span>
                                    </div>

                                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                                        <Link
                                            to={`/tickets/${ticket.id}`}
                                            className="transition hover:text-indigo-600"
                                        >
                                            {ticket.title}
                                        </Link>
                                    </h2>

                                    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                                        {ticket.description}
                                    </p>

                                    <p className="mt-4 text-xs text-gray-400">
                                        Created: {new Date(ticket.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                  <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(ticket.status)}`}
                  >
                    {formatStatusLabel(ticket.status)}
                  </span>

                                    {ticket.priority && (
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadgeClasses(ticket.priority)}`}
                                        >
                      {formatPriorityLabel(ticket.priority)}
                    </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">
                            No tickets found
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Prueba a cambiar los filtros o crea una nueva incidencia.
                        </p>
                        <Link
                            to="/tickets/new"
                            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                            Create Ticket
                        </Link>
                    </div>
                )}
            </section>

            {meta && meta.last_page > 1 && (
                <section className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            Page {meta.current_page} of {meta.last_page}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            Total results: {meta.total}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= meta.last_page}
                            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}