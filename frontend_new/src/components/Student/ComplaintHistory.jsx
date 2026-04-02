import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ComplaintHistory = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints/my-complaints');
            setComplaints(response.data);
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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Complaint History</h2>
            <p className="text-gray-600 mb-8">View all your submitted complaints</p>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                {complaints.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No complaints found</p>
                ) : (
                    <div className="space-y-4">
                        {complaints.map((complaint) => (
                            <div key={complaint.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Complaint ID and Title in same row */}
                                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">
                                                {complaint.complaint_id}
                                            </span>
                                            <h4 className="font-semibold text-gray-800 text-lg">
                                                {complaint.title}
                                            </h4>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 mt-1">
                                            {complaint.category} • {complaint.location} • {complaint.date}
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
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${getStatusColor(complaint.status)}`}>
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

export default ComplaintHistory;