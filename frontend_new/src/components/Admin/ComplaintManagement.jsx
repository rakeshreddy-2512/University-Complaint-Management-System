import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints/all');
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

    const getStatusText = (status) => {
        switch(status) {
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return 'Pending';
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Complaints</h2>
            <p className="text-gray-600 mb-8">Monitor and manage all complaints</p>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Student</th>
                            <th className="text-left py-3 px-4">Category</th>
                            <th className="text-left py-3 px-4">Location</th>
                            <th className="text-left py-3 px-4">Image</th>
                            <th className="text-left py-3 px-4">Assigned To</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Date</th>
                            <th className="text-left py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint) => (
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
                                <td className="py-3 px-4">{complaint.assigned_to || 'Unassigned'}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(complaint.status)}`}>
                                        {getStatusText(complaint.status)}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{complaint.date}</td>
                                <td className="py-3 px-4">
                                    <select
                                        value={complaint.status}
                                        onChange={(e) => updateStatus(complaint.id, e.target.value)}
                                        className="px-2 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {complaints.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center py-8 text-gray-500">
                                    No complaints found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComplaintManagement;