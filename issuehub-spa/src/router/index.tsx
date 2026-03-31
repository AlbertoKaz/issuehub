import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import TicketsPage from '../pages/TicketsPage';
import NewTicketPage from '../pages/NewTicketPage';
import TicketDetailPage from '../pages/TicketDetailPage';
import EditTicketPage from '../pages/EditTicketPage';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'tickets', element: <TicketsPage /> },
            { path: 'tickets/new', element: <NewTicketPage /> },
            { path: 'tickets/:id', element: <TicketDetailPage /> },
            { path: 'tickets/:id/edit', element: <EditTicketPage /> },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}