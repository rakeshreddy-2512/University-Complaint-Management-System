import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const NewComplaint = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        location: '',
        description: '',
        image: null
    });

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');
        
        if (file) {
            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size must be less than 5MB');
                setFormData({ ...formData, image: null });
                setImagePreview(null);
                return;
            }
            
            // Check file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setImageError('Only JPG, PNG, and GIF images are allowed');
                setFormData({ ...formData, image: null });
                setImagePreview(null);
                return;
            }
            
            setFormData({
                ...formData,
                image: file
            });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // VALIDATION: Check if image is selected
        if (!formData.image) {
            toast.error('Please upload an image proof. Image is mandatory!');
            setImageError('Image proof is required');
            return;
        }
        
        setLoading(true);
        
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('location', formData.location);
            data.append('description', formData.description);
            data.append('image', formData.image); // Image is now mandatory

            const response = await api.post('/complaints', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Complaint submitted successfully!');
            navigate('/student');
        } catch (error) {
            console.error('Submission error:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit complaint. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Raise a Complaint</h2>
            <p className="text-gray-600 mb-8">Submit a new complaint with image proof (Image is mandatory)</p>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief title of your complaint"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select category</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Block A, Room 203"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the issue in detail"
                        required
                    ></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image Proof <span className="text-red-500">* (Mandatory)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required={!formData.image}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Max size: 5MB. Allowed: JPG, PNG, GIF. Image is mandatory!
                    </p>
                    
                    {imageError && (
                        <p className="text-red-500 text-xs mt-1">{imageError}</p>
                    )}
                    
                    {imagePreview && (
                        <div className="mt-3">
                            <img src={imagePreview} alt="Preview" className="max-w-full h-40 object-cover rounded-lg border" />
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ ...formData, image: null });
                                    setImagePreview(null);
                                    setImageError('');
                                }}
                                className="mt-2 text-red-600 text-sm hover:text-red-800"
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !formData.image}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewComplaint;