import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Reports = () => {
    const [stats, setStats] = useState({
        categoryStats: [],
        statusStats: []
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await api.get('/reports/dashboard');
            setStats({
                categoryStats: response.data.categoryStats,
                statusStats: response.data.statusStats
            });
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const statusChartData = {
        labels: stats.statusStats.map(s => s.status === 'in_progress' ? 'In Progress' : s.status.charAt(0).toUpperCase() + s.status.slice(1)),
        datasets: [
            {
                label: 'Complaints by Status',
                data: stats.statusStats.map(s => s.count),
                backgroundColor: ['#F59E0B', '#3B82F6', '#10B981'],
                borderColor: ['#D97706', '#2563EB', '#059669'],
                borderWidth: 1,
            },
        ],
    };

    const categoryChartData = {
        labels: stats.categoryStats.map(s => s.category),
        datasets: [
            {
                label: 'Complaints by Category',
                data: stats.categoryStats.map(s => s.count),
                backgroundColor: [
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'
                ],
                borderColor: [
                    '#DC2626', '#D97706', '#059669', '#2563EB', '#6D28D9', '#DB2777'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>
            <p className="text-gray-600 mb-8">Analytics and statistics overview</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Status</h3>
                    <div className="h-80">
                        <Pie data={statusChartData} options={chartOptions} />
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints by Category</h3>
                    <div className="h-80">
                        <Bar data={categoryChartData} options={chartOptions} />
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.categoryStats.map((stat, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600">{stat.category}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;