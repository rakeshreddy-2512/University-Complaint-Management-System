const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// Student: Create new complaint with image (image is mandatory)
const createComplaint = async (req, res) => {
    try {
        const { title, category, location, description } = req.body;
        const studentId = req.user.id;
        
        // CHECK: Image is mandatory
        if (!req.file) {
            return res.status(400).json({ message: 'Image proof is required. Please upload an image.' });
        }
        
        // Get the image path from multer
        const imagePath = `/uploads/${req.file.filename}`;

        if (!title || !category || !location || !description) {
            // If validation fails, delete the uploaded image
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get department ID for the category
        const [departments] = await db.query(
            'SELECT id FROM departments WHERE name = ?',
            [category]
        );

        if (departments.length === 0) {
            // Delete uploaded image if department invalid
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'Invalid category' });
        }

        const departmentId = departments[0].id;

        // Find staff assigned to this department
        const [staff] = await db.query(
            `SELECT u.id FROM users u
             JOIN staff_departments sd ON u.id = sd.staff_id
             WHERE sd.department_id = ? AND u.role = 'staff'
             LIMIT 1`,
            [departmentId]
        );

        const assignedStaffId = staff.length > 0 ? staff[0].id : null;

        // Generate complaint_id (e.g., CMP000001)
        const [lastComplaint] = await db.query(
            'SELECT complaint_id FROM complaints ORDER BY id DESC LIMIT 1'
        );
        
        let newComplaintId = 'CMP000001';
        if (lastComplaint.length > 0 && lastComplaint[0].complaint_id) {
            const lastNum = parseInt(lastComplaint[0].complaint_id.substring(3));
            const nextNum = lastNum + 1;
            newComplaintId = `CMP${String(nextNum).padStart(6, '0')}`;
        }

        // Create complaint with image
        const [result] = await db.query(
            `INSERT INTO complaints (complaint_id, title, category, location, description, status, student_id, assigned_staff_id, image_path)
             VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
            [newComplaintId, title, category, location, description, studentId, assignedStaffId, imagePath]
        );

        res.status(201).json({
            message: 'Complaint submitted successfully',
            complaintId: result.insertId,
            complaintNumber: newComplaintId,
            imagePath: imagePath
        });
    } catch (error) {
        console.error('Error creating complaint:', error);
        // Delete uploaded image if error occurs
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Student: Get user's complaints with images
const getUserComplaints = async (req, res) => {
    try {
        const [complaints] = await db.query(
            `SELECT id, complaint_id, title, category, location, description, status, image_path,
                    DATE_FORMAT(created_at, '%m/%d/%Y') as date
             FROM complaints 
             WHERE student_id = ?
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Staff: Get assigned complaints with images
const getAssignedComplaints = async (req, res) => {
    try {
        const [complaints] = await db.query(
            `SELECT c.id, c.complaint_id, c.title, c.category, c.location, c.description, c.status, c.image_path,
                    DATE_FORMAT(c.created_at, '%m/%d/%Y') as date,
                    u.name as student_name, u.email as student_email
             FROM complaints c
             JOIN users u ON c.student_id = u.id
             WHERE c.assigned_staff_id = ?
             ORDER BY c.created_at DESC`,
            [req.user.id]
        );

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching assigned complaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Staff/Admin: Update complaint status
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'in_progress', 'resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if complaint is assigned to this staff or user is admin
        const [complaints] = await db.query(
            'SELECT assigned_staff_id FROM complaints WHERE id = ?',
            [id]
        );

        if (complaints.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaints[0].assigned_staff_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this complaint' });
        }

        await db.query(
            'UPDATE complaints SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({ message: 'Complaint status updated successfully' });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all complaints with images
const getAllComplaints = async (req, res) => {
    try {
        const [complaints] = await db.query(
            `SELECT c.id, c.complaint_id, c.title, c.category, c.location, c.status, c.image_path,
                    DATE_FORMAT(c.created_at, '%m/%d/%Y') as date,
                    u.name as student_name,
                    s.name as assigned_to
             FROM complaints c
             JOIN users u ON c.student_id = u.id
             LEFT JOIN users s ON c.assigned_staff_id = s.id
             ORDER BY c.created_at DESC`
        );

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching all complaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single complaint by complaint_id (for search)
const getComplaintById = async (req, res) => {
    try {
        const { complaintId } = req.params;
        
        const [complaints] = await db.query(
            `SELECT c.id, c.complaint_id, c.title, c.category, c.location, c.description, c.status, c.image_path,
                    DATE_FORMAT(c.created_at, '%m/%d/%Y %H:%i') as date,
                    u.name as student_name, u.email as student_email,
                    s.name as assigned_staff_name
             FROM complaints c
             JOIN users u ON c.student_id = u.id
             LEFT JOIN users s ON c.assigned_staff_id = s.id
             WHERE c.complaint_id = ?`,
            [complaintId]
        );

        if (complaints.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.json(complaints[0]);
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createComplaint,
    getUserComplaints,
    getAssignedComplaints,
    updateComplaintStatus,
    getAllComplaints,
    getComplaintById
};