import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentComplaints();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/reports/dashboard');
            setStats({
                total: response.data.total,
                pending: response.data.pending,
                inProgress: response.data.inProgress,
                resolved: response.data.resolved
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentComplaints = async () => {
        try {
            const response = await api.get('/complaints/all');
            setRecentComplaints(response.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const statCards = [
        { label: 'Total Complaints', value: stats.total, icon: FiTrendingUp, color: 'bg-blue-500' },
        { label: 'Pending', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.inProgress, icon: FiAlertCircle, color: 'bg-orange-500' },
        { label: 'Resolved', value: stats.resolved, icon: FiCheckCircle, color: 'bg-green-500' },
    ];

    const getStatusText = (status) => {
        switch(status) {
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return 'Pending';
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
            <p className="text-gray-600 mb-8">Overview of the complaint management system</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Complaints</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">ID</th>
                                <th className="text-left py-3 px-4">Title</th>
                                <th className="text-left py-3 px-4">Student</th>
                                <th className="text-left py-3 px-4">Category</th>
                                <th className="text-left py-3 px-4">Location</th>
                                <th className="text-left py-3 px-4">Image</th>
                                <th className="text-left py-3 px-4">Status</th>
                                <th className="text-left py-3 px-4">Date</th>
                             </tr>
                        </thead>
                        <tbody>
                            {recentComplaints.map((complaint) => (
                                <tr key={complaint.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                                            {complaint.complaint_id}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-medium">{complaint.title}</td>
                                    <td className="py-3 px-4">{complaint.student_name}</td>
                                    <td className="py-3 px-4">{complaint.category}</td>
                                    <td className="py-3 px-4">{complaint.location}</td>
                                    <td className="py-3 px-4">
                                        {complaint.image_path ? (
                                            <img 
                                                src={`http://localhost:5000${complaint.image_path}`} 
                                                alt="Proof" 
                                                className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-80"
                                                onClick={() => window.open(`http://localhost:5000${complaint.image_path}`, '_blank')}
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No image</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                                            {getStatusText(complaint.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{complaint.date}</td>
                                </tr>
                            ))}
                            {recentComplaints.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-500">
                                        No complaints found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;