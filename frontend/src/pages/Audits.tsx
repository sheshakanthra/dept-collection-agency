import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { AuditLog } from '../types';

const Audits = () => {
    const [audits, setAudits] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const response = await api.get('/audit/');
                setAudits(response.data);
            } catch (error) {
                console.error('Failed to fetch audits', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAudits();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="px-6 py-4 text-lg font-medium text-gray-900 border-b">Audit Logs</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">Loading audits...</td>
                            </tr>
                        ) : audits.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center">No audit logs found</td>
                            </tr>
                        ) : (
                            audits.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.entity_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.performed_by}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Audits;
