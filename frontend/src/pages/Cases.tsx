import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Case } from '../types';

const Cases = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        amount_due: '',
        ageing_days: '',
        case_id: ''
    });

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const response = await api.get('/cases/');
            setCases(response.data);
        } catch (error) {
            console.error('Failed to fetch cases', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/cases/', {
                ...formData,
                amount_due: parseFloat(formData.amount_due),
                ageing_days: parseInt(formData.ageing_days),
                // Auto-generate case_id if empty or let backend handle it? 
                // Backend expects 'case_id'. Let's generate a simple one if user skips.
                case_id: formData.case_id || `CASE-${Math.floor(Math.random() * 10000)}`
            });
            setIsModalOpen(false);
            setFormData({ customer_name: '', amount_due: '', ageing_days: '', case_id: '' });
            fetchCases(); // Refresh list
        } catch (error) {
            console.error("Failed to create case", error);
            alert("Failed to create case");
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Case List</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
                >
                    + New Case
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Due</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">Loading cases...</td>
                            </tr>
                        ) : cases.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center">No cases found</td>
                            </tr>
                        ) : (
                            cases.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.case_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.customer_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${c.amount_due ? c.amount_due.toLocaleString() : '0'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(c.priority)}`}>
                                            {c.priority || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        View Details
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[2px]">
                    {/* Overlay background with opacity for visibility logic if needed, but flex centered above is key */}
                    <div className="absolute inset-0 bg-gray-600 opacity-50" onClick={() => setIsModalOpen(false)}></div>

                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative z-10">
                        <h2 className="text-xl font-bold mb-4">Create New Case</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                                <input
                                    name="customer_name"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.customer_name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount Due ($)</label>
                                <input
                                    name="amount_due"
                                    type="number"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.amount_due}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ageing Days</label>
                                <input
                                    name="ageing_days"
                                    type="number"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.ageing_days}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Create Case
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cases;
