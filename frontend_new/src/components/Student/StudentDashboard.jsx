import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const StudentDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
    const [recentComplaints, setRecentComplaints] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentComplaints();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/reports/student-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentComplaints = async () => {
        try {
            const response = await api.get('/complaints/my-complaints');
            setRecentComplaints(response.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'in_progress': return 'text-blue-600 bg-blue-100';
            case 'resolved': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return 'Pending';
        }
    };

    const statCards = [
        { label: 'Total', value: stats.total, icon: FiTrendingUp, color: 'bg-blue-500' },
        { label: 'Pending', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.inProgress, icon: FiAlertCircle, color: 'bg-orange-500' },
        { label: 'Resolved', value: stats.resolved, icon: FiCheckCircle, color: 'bg-green-500' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>
            <p className="text-gray-600 mb-8">Track your complaints and their status</p>
            
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
                {recentComplaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No complaints found</p>
                ) : (
                    <div className="space-y-4">
                        {recentComplaints.map((complaint) => (
                            <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Complaint ID and Title */}
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                                                {complaint.complaint_id}
                                            </span>
                                            <h4 className="font-semibold text-gray-800">
                                                {complaint.title}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {complaint.category} • {complaint.location} • {complaint.date}
                                        </p>
                                        
                                        {/* Display image thumbnail if exists */}
                                        {complaint.image_path && (
                                            <div className="mt-2">
                                                <img 
                                                    src={`http://localhost:5000${complaint.image_path}`} 
                                                    alt="Proof" 
                                                    className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                                                    onClick={() => window.open(`http://localhost:5000${complaint.image_path}`, '_blank')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                                        {getStatusText(complaint.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;