import {type FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTicket } from '../api/tickets';

export default function NewTicketPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const mutation = useMutation({
        mutationFn: createTicket,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ['tickets'] });
                await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
                await queryClient.invalidateQueries({ queryKey: ['dashboard-recent-tickets'] });
                navigate('/tickets');
            },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data?.message || 'No se pudo crear el ticket.');
            } else {
                setErrorMessage('Ha ocurrido un error inesperado.');
            }
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage('');

        mutation.mutate({
            title,
            description,
        });
    }

    return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">New Ticket</h1>
            <p className="mt-2 text-sm text-gray-600">
                Crea un nuevo ticket en IssueHub.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                        placeholder="Bug in dashboard"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="min-h-36 w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-indigo-500"
                        placeholder="Describe the issue..."
                        required
                    />
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {mutation.isPending ? 'Creating...' : 'Create Ticket'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/tickets')}
                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}