export function getStatusBadgeClasses(status: string): string {
    switch (status) {
        case 'open':
            return 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200';
        case 'in_progress':
            return 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200';
        case 'closed':
            return 'bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300';
        default:
            return 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200';
    }
}

export function formatStatusLabel(status: string): string {
    switch (status) {
        case 'in_progress':
            return 'In progress';
        case 'open':
            return 'Open';
        case 'closed':
            return 'Closed';
        default:
            return status;
    }
}

export function getPriorityBadgeClasses(priority: string): string {
    switch (priority) {
        case 'low':
            return 'bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-200';
        case 'medium':
            return 'bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-200';
        case 'high':
            return 'bg-rose-100 text-rose-700 ring-1 ring-inset ring-rose-200';
        default:
            return 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200';
    }
}

export function formatPriorityLabel(priority: string): string {
    switch (priority) {
        case 'low':
            return 'Low';
        case 'medium':
            return 'Medium';
        case 'high':
            return 'High';
        default:
            return priority;
    }
}