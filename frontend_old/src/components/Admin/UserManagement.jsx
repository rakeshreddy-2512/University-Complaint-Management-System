import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [students, setStudents] = useState([]);
    const [staff, setStaff] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        departmentId: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setStudents(response.data.students);
            setStaff(response.data.staff);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            toast.success('User added successfully');
            fetchUsers();
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '', role: 'student', departmentId: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Add New User
                </button>
            </div>
            <p className="text-gray-600 mb-8">Add, view, and manage students and staff</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Students ({students.length})</h3>
                    <div className="space-y-3">
                        {students.map((student) => (
                            <div key={student.id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                    <p className="text-sm text-gray-600">{student.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteUser(student.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Staff ({staff.length})</h3>
                    <div className="space-y-3">
                        {staff.map((member) => (
                            <div key={member.id} className="border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">{member.name}</p>
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteUser(member.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New User</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="student">Student</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                            {formData.role === 'staff' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Department</label>
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="">Select department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;