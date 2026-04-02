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
                                        <h4 className="font-semibold text-gray-800 text-lg">{complaint.title}</h4>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {complaint.category} • {complaint.location} • {complaint.date}
                                        </p>
                                        <p className="text-gray-700 mt-2">{complaint.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                                        {complaint.status === 'in_progress' ? 'In Progress' : 
                                         complaint.status === 'resolved' ? 'Resolved' : 'Pending'}
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