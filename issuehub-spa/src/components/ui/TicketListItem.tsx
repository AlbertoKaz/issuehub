import { Link } from 'react-router-dom';
import type { Ticket } from '../../types/ticket';
import {
    formatPriorityLabel,
    formatStatusLabel,
    getPriorityBadgeClasses,
    getStatusBadgeClasses,
} from '../../lib/tickets';

type TicketListItemProps = {
    ticket: Ticket;
};

export default function TicketListItem({ ticket }: TicketListItemProps) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Ticket #{ticket.id}
                    </p>

                    <h3 className="mt-2 text-base font-semibold tracking-tight text-gray-900">
                        <Link
                            to={`/tickets/${ticket.id}`}
                            className="transition hover:text-indigo-600"
                        >
                            {ticket.title}
                        </Link>
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                        {ticket.description}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
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
    );
}