import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SearchComplaint = () => {
    const [complaintId, setComplaintId] = useState('');
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!complaintId.trim()) {
            toast.error('Please enter a Complaint ID');
            return;
        }

        setLoading(true);
        setSearched(true);
        
        try {
            const response = await api.get(`/complaints/search/${complaintId}`);
            setComplaint(response.data);
            toast.success('Complaint found!');
        } catch (error) {
            setComplaint(null);
            toast.error(error.response?.data?.message || 'Complaint not found');
        } finally {
            setLoading(false);
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

    const getStatusText = (status) => {
        switch(status) {
            case 'in_progress': return 'In Progress';
            case 'resolved': return 'Resolved';
            default: return 'Pending';
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Complaint by ID</h2>
                
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={complaintId}
                            onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                            placeholder="Enter Complaint ID (e.g., CMP000001)"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">Example: CMP000001, CMP000002</p>
                </div>

                {/* Search Results */}
                {searched && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {complaint ? (
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xl font-bold text-gray-800">
                                                {complaint.complaint_id}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                                                {getStatusText(complaint.status)}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">{complaint.title}</h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-medium">{complaint.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">{complaint.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Submitted By</p>
                                        <p className="font-medium">{complaint.student_name} ({complaint.student_email})</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Assigned To</p>
                                        <p className="font-medium">{complaint.assigned_staff_name || 'Unassigned'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Submitted Date</p>
                                        <p className="font-medium">{complaint.date}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">Description</p>
                                    <p className="text-gray-700">{complaint.description}</p>
                                </div>

                                {complaint.image_path && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Proof Image</p>
                                        <img 
                                            src={`http://localhost:5000${complaint.image_path}`} 
                                            alt="Complaint Proof" 
                                            className="max-w-full h-48 object-cover rounded-lg border shadow-sm cursor-pointer hover:opacity-80"
                                            onClick={() => window.open(`http://localhost:5000${complaint.image_path}`, '_blank')}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No complaint found with ID: {complaintId}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchComplaint;