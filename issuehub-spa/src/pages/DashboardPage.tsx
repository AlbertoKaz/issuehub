import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard';
import { getTickets } from '../api/tickets';
import TicketListItem from '../components/ui/TicketListItem';
import type { DashboardStats } from '../types/dashboard';
import type { PaginatedTicketsResponse } from '../types/ticket';

export default function DashboardPage() {
    const {
        data: stats,
        isLoading: isStatsLoading,
        isError: isStatsError,
        error: statsError,
    } = useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: getDashboardStats,
    });

    const {
        data: recentTicketsData,
        isLoading: isRecentLoading,
        isError: isRecentError,
        error: recentError,
    } = useQuery<PaginatedTicketsResponse>({
        queryKey: ['dashboard-recent-tickets'],
        queryFn: () => getTickets({ page: 1 }),
    });

    if (isStatsLoading) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-4 text-sm text-gray-600">Cargando estadísticas...</p>
            </div>
        );
    }

    if (isStatsError) {
        return (
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-4 text-sm text-red-600">
                    Error al cargar estadísticas.
                </p>
                <pre className="mt-4 rounded-2xl bg-red-50 p-4 text-xs text-red-700">
          {statsError instanceof Error ? statsError.message : 'Unknown error'}
        </pre>
            </div>
        );
    }

    const recentTickets = recentTicketsData?.data.slice(0, 5) ?? [];

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                            IssueHub Overview
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Dashboard
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                            Resumen general de tu actividad. Desde aquí puedes ver el estado de
                            tus tickets y acceder rápidamente a la zona de gestión.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/tickets"
                            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                        >
                            View Tickets
                        </Link>
                        <Link
                            to="/tickets/new"
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            New Ticket
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Total Tickets</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {stats?.total ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">All tickets created by you</p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Open</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
                        {stats?.open ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Pending attention</p>
                </div>

                <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-amber-600">
                        {stats?.in_progress ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Currently being worked on</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Closed</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-700">
                        {stats?.closed ?? 0}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">Completed tickets</p>
                </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                            Recent Activity
                        </p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                            Recent Tickets
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Tus tickets más recientes, con acceso directo al detalle.
                        </p>
                    </div>

                    <Link
                        to="/tickets"
                        className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                    >
                        View all tickets →
                    </Link>
                </div>

                <div className="mt-6 space-y-4">
                    {isRecentLoading && (
                        <p className="text-sm text-gray-600">Cargando tickets recientes...</p>
                    )}

                    {isRecentError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {recentError instanceof Error
                                ? recentError.message
                                : 'No se pudieron cargar los tickets recientes.'}
                        </div>
                    )}

                    {!isRecentLoading && !isRecentError && recentTickets.length > 0 && (
                        recentTickets.map((ticket) => (
                            <TicketListItem key={ticket.id} ticket={ticket} />
                        ))
                    )}

                    {!isRecentLoading && !isRecentError && recentTickets.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No recent tickets yet
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Crea tu primera incidencia para empezar a ver actividad aquí.
                            </p>
                            <Link
                                to="/tickets/new"
                                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                            >
                                Create Ticket
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}