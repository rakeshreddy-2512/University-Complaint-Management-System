import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';

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
        <div className="p-8">
            <h1 className="text-2xl">Welcome {user.name}!</h1>
            <p>Your role: {user.role}</p>
        </div>
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