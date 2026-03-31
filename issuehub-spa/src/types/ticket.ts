export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string;
    created_at: string;
    updated_at: string;
};

export type PaginatedTicketsResponse = {
    data: Ticket[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first?: string | null;
        last?: string | null;
        prev?: string | null;
        next?: string | null;
    };
};