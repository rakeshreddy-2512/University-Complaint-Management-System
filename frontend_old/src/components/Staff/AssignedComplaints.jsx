import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AssignedComplaints = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints/assigned');
            setComplaints(response.data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/complaints/${id}/status`, { status });
            toast.success('Status updated successfully');
            fetchComplaints();
        } catch (error) {
            toast.error('Failed to update status');
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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Assigned Complaints</h2>
            <p className="text-gray-600 mb-8">View and manage complaints assigned to you</p>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                {complaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No assigned complaints</p>
                ) : (
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 text-lg">{complaint.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {complaint.category} • {complaint.location} • {complaint.date}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Student: {complaint.student_name} ({complaint.student_email})
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                                                    {complaint.status === 'in_progress' ? 'In Progress' : 
                                                     complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
                                                </span>
                                                <select
                                                    value={complaint.status}
                                                    onChange={(e) => updateStatus(complaint.id, e.target.value)}
                                                    className="px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-3">{complaint.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignedComplaints;