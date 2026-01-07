import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import type { User } from '../types';

const Layout = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Cases', path: '/cases' },
        { label: 'Audits', path: '/audits' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
                <h1 className="text-2xl font-bold mb-8">FedEx DCA</h1>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block py-2 px-4 rounded ${location.pathname === item.path
                                ? 'bg-indigo-600'
                                : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    {user?.role === 'admin' && (
                        <a href="#" className="block py-2 px-4 rounded bg-slate-800 hover:bg-slate-700 text-yellow-400">
                            Admin Panel
                        </a>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                        <p className="text-gray-600">
                            Welcome back, {user ? <span className="font-semibold text-indigo-600">{user.username}</span> : '...'}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </header>

                <Outlet context={{ user }} />
            </main>
        </div>
    );
};

export default Layout;
