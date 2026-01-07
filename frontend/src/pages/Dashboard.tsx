import { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        pendingCases: 0,
        completedAudits: 0,
        systemHealth: 'Unknown',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const [casesRes, auditsRes, healthRes] = await Promise.all([
                    api.get('/cases/'),
                    api.get('/audit/'),
                    api.get('/health'),
                ]);

                setStats({
                    pendingCases: casesRes.data.length,
                    completedAudits: auditsRes.data.length,
                    systemHealth: healthRes.data.status === 'ok' ? 'Operational' : 'Degraded',
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                <h3 className="text-xl font-bold mb-2">Total Cases</h3>
                <p className="text-3xl font-bold text-gray-800">
                    {loading ? '...' : stats.pendingCases}
                </p>
                <p className="text-sm text-gray-500 mt-2">Active in database</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                <h3 className="text-xl font-bold mb-2">Total Audits</h3>
                <p className="text-3xl font-bold text-gray-800">
                    {loading ? '...' : stats.completedAudits}
                </p>
                <p className="text-sm text-gray-500 mt-2">Logged events</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-2">System Health</h3>
                <p className={`text-xl font-bold ${stats.systemHealth === 'Operational' ? 'text-green-600' : 'text-red-500'}`}>
                    {loading ? 'Checking...' : stats.systemHealth}
                </p>
                <p className="text-sm text-gray-500 mt-2">Real-time status</p>
            </div>
        </div>
    );
};

export default Dashboard;
