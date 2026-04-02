import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiClock, FiAlertCircle, FiFolder } from 'react-icons/fi';

const StaffDashboard = () => {
    const [stats, setStats] = useState({ assigned: 0, pending: 0, inProgress: 0, resolved: 0 });
    const [activeComplaints, setActiveComplaints] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchActiveComplaints();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/reports/staff-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchActiveComplaints = async () => {
        try {
            const response = await api.get('/complaints/assigned');
            setActiveComplaints(response.data.filter(c => c.status !== 'resolved'));
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/complaints/${id}/status`, { status });
            toast.success('Status updated successfully');
            fetchStats();
            fetchActiveComplaints();
        } catch (error) {
            toast.error('Failed to update status');
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
        { label: 'Assigned', value: stats.assigned, icon: FiFolder, color: 'bg-blue-500' },
        { label: 'Pending', value: stats.pending, icon: FiClock, color: 'bg-yellow-500' },
        { label: 'In Progress', value: stats.inProgress, icon: FiAlertCircle, color: 'bg-orange-500' },
        { label: 'Resolved', value: stats.resolved, icon: FiCheckCircle, color: 'bg-green-500' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Staff Dashboard</h2>
            <p className="text-gray-600 mb-8">Manage your assigned complaints</p>
            
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Complaints</h3>
                {activeComplaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No active complaints</p>
                ) : (
                    <div className="space-y-4">
                        {activeComplaints.map((complaint) => (
                            <div key={complaint.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
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
                                        
                                        <p className="text-sm text-gray-600">
                                            {complaint.category} • {complaint.location}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Student: {complaint.student_name}
                                        </p>
                                        <p className="text-gray-700 mt-2">{complaint.description}</p>
                                        
                                        {/* Display image if exists */}
                                        {complaint.image_path && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Proof Image:</p>
                                                <img 
                                                    src={`http://localhost:5000${complaint.image_path}`} 
                                                    alt="Complaint Proof" 
                                                    className="max-w-full h-32 object-cover rounded-lg border shadow-sm cursor-pointer hover:opacity-80"
                                                    onClick={() => window.open(`http://localhost:5000${complaint.image_path}`, '_blank')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => updateStatus(complaint.id, e.target.value)}
                                        className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 ml-4"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboard;