import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    FiHome, 
    FiFileText, 
    FiPlus, 
    FiUsers, 
    FiFolder, 
    FiBarChart2,
    FiLogOut
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const studentLinks = [
        { to: '/student', icon: FiHome, label: 'Dashboard' },
        { to: '/student/new-complaint', icon: FiPlus, label: 'New Complaint' },
        { to: '/student/history', icon: FiFileText, label: 'My Complaints' },
    ];

    const staffLinks = [
        { to: '/staff', icon: FiHome, label: 'Dashboard' },
        { to: '/staff/assigned', icon: FiFolder, label: 'Assigned' },
    ];

    const adminLinks = [
        { to: '/admin', icon: FiHome, label: 'Dashboard' },
        { to: '/admin/users', icon: FiUsers, label: 'Users' },
        { to: '/admin/complaints', icon: FiFileText, label: 'Complaints' },
        { to: '/admin/departments', icon: FiFolder, label: 'Departments' },
        { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
    ];

    let links = [];
    if (user?.role === 'student') links = studentLinks;
    else if (user?.role === 'staff') links = staffLinks;
    else if (user?.role === 'admin') links = adminLinks;

    return (
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-blue-600">UniComplaint</h1>
            </div>
            
            <div className="p-4">
                <div className="mb-6">
                    <p className="text-sm text-gray-600">Welcome,</p>
                    <p className="font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                
                <nav className="space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`
                            }
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                    <FiLogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;