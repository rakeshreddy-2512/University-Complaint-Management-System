import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import StudentDashboard from './components/Student/StudentDashboard';
import NewComplaint from './components/Student/NewComplaint';
import ComplaintHistory from './components/Student/ComplaintHistory';
import StaffDashboard from './components/Staff/StaffDashboard';
import AssignedComplaints from './components/Staff/AssignedComplaints';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import ComplaintManagement from './components/Admin/ComplaintManagement';
import DepartmentManagement from './components/Admin/DepartmentManagement';
import Reports from './components/Admin/Reports';
import SearchComplaint from './components/Search/SearchComplaint';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={`/${user.role}`} />;
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
};

const AppContent = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={<Navigate to={`/${user.role}`} />} />
            
            {/* Student Routes */}
            <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                </ProtectedRoute>
            } />
            <Route path="/student/new-complaint" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <NewComplaint />
                </ProtectedRoute>
            } />
            <Route path="/student/history" element={
                <ProtectedRoute allowedRoles={['student']}>
                    <ComplaintHistory />
                </ProtectedRoute>
            } />
            
            {/* Staff Routes */}
            <Route path="/staff" element={
                <ProtectedRoute allowedRoles={['staff']}>
                    <StaffDashboard />
                </ProtectedRoute>
            } />
            <Route path="/staff/assigned" element={
                <ProtectedRoute allowedRoles={['staff']}>
                    <AssignedComplaints />
                </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                </ProtectedRoute>
            } />
            <Route path="/admin/complaints" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <ComplaintManagement />
                </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <DepartmentManagement />
                </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <Reports />
                </ProtectedRoute>
            } />
            
            {/* Search Route - Available to all authenticated users */}
            <Route path="/search" element={
                <ProtectedRoute>
                    <SearchComplaint />
                </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to={`/${user.role}`} />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-right" />
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;