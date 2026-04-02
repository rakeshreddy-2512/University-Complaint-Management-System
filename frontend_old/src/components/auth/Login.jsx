import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin');
            } else if (result.user.role === 'staff') {
                navigate('/staff');
            } else {
                navigate('/student');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">UniComplaint</h1>
                    <p className="text-gray-600 mt-2">University Complaint Management System</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Sign In
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Demo Credentials:</p>
                    <p>Admin: admin@university.com / admin123</p>
                    <p>Staff: puneeth@university.com / staff123</p>
                    <p>Student: jyotir@university.com / student123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;