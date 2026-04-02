import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/departments', formData);
            toast.success('Department added successfully');
            fetchDepartments();
            setShowAddModal(false);
            setFormData({ name: '', description: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add department');
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await api.delete(`/departments/${id}`);
                toast.success('Department deleted successfully');
                fetchDepartments();
            } catch (error) {
                toast.error('Failed to delete department');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add Department
                </button>
            </div>
            <p className="text-gray-600 mb-8">Manage departments for complaint routing</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                            <button
                                onClick={() => handleDeleteDepartment(dept.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Delete
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{dept.description || 'No description'}</p>
                        {dept.staff && dept.staff.length > 0 && (
                            <div className="border-t pt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Assigned Staff:</p>
                                {dept.staff.map((staff) => (
                                    <p key={staff.id} className="text-sm text-gray-600">{staff.name}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Department</h3>
                        <form onSubmit={handleAddDepartment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Department Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;