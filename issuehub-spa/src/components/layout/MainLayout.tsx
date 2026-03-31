import { Link, Outlet, useNavigate } from 'react-router-dom';
import { removeToken } from '../../lib/auth';

export default function MainLayout() {
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link to="/" className="text-lg font-semibold">
                        IssueHub SPA
                    </Link>

                    <nav className="flex items-center gap-4 text-sm">
                        <Link to="/" className="hover:text-indigo-600">
                            Dashboard
                        </Link>
                        <Link to="/tickets" className="hover:text-indigo-600">
                            Tickets
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">
                <Outlet />
            </main>
        </div>
    );
}