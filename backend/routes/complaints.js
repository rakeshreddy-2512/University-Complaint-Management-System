const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const {
    createComplaint,
    getUserComplaints,
    getAssignedComplaints,
    updateComplaintStatus,
    getAllComplaints
} = require('../controllers/complaintController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: async function (req, file, cb) {
        try {
            // Get title from request body
            const title = req.body.title || 'complaint';
            // Clean title: remove spaces and special characters
            const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
            
            // Get the next complaint_id to use for naming
            const [lastComplaint] = await db.query(
                'SELECT complaint_id FROM complaints ORDER BY id DESC LIMIT 1'
            );
            
            let complaintId = 'CMP000001';
            if (lastComplaint.length > 0 && lastComplaint[0].complaint_id) {
                const lastNum = parseInt(lastComplaint[0].complaint_id.substring(3));
                const nextNum = lastNum + 1;
                complaintId = `CMP${String(nextNum).padStart(6, '0')}`;
            }
            
            // Get file extension
            const ext = path.extname(file.originalname);
            // Create filename: problemname_complaintid.ext
            const filename = `${cleanTitle}_${complaintId}${ext}`;
            cb(null, filename);
        } catch (error) {
            console.error('Error generating filename:', error);
            const ext = path.extname(file.originalname);
            const fallbackName = `complaint_${Date.now()}${ext}`;
            cb(null, fallbackName);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Create new complaint (with image upload - MANDATORY)
router.post('/', 
    authenticateToken, 
    checkRole('student'), 
    (req, res, next) => {
        upload.single('image')(req, res, (err) => {
            if (err) {
                console.error('Upload error:', err.message);
                return res.status(400).json({ message: err.message });
            }
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'Image proof is required. Please upload an image.' });
            }
            next();
        });
    }, 
    createComplaint
);

// Student: Get user's complaints
router.get('/my-complaints', authenticateToken, checkRole('student'), getUserComplaints);

// Staff: Get assigned complaints
router.get('/assigned', authenticateToken, checkRole('staff'), getAssignedComplaints);

// Staff/Admin: Update complaint status
router.put('/:id/status', authenticateToken, checkRole('staff', 'admin'), updateComplaintStatus);

// Admin: Get all complaints
router.get('/all', authenticateToken, checkRole('admin'), getAllComplaints);

// Search complaint by ID (available to all authenticated users)
router.get('/search/:complaintId', authenticateToken, async (req, res) => {
    try {
        const { complaintId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        let query = `
            SELECT c.id, c.complaint_id, c.title, c.category, c.location, 
                   c.description, c.status, c.image_path,
                   DATE_FORMAT(c.created_at, '%m/%d/%Y %H:%i') as date,
                   u.name as student_name, u.email as student_email,
                   s.name as assigned_staff_name
            FROM complaints c
            JOIN users u ON c.student_id = u.id
            LEFT JOIN users s ON c.assigned_staff_id = s.id
            WHERE c.complaint_id = ?
        `;

        if (userRole === 'student') {
            query += ` AND c.student_id = ?`;
            const [complaints] = await db.query(query, [complaintId, userId]);
            
            if (complaints.length === 0) {
                return res.status(404).json({ message: 'Complaint not found or access denied' });
            }
            return res.json(complaints[0]);
        }
        
        const [complaints] = await db.query(query, [complaintId]);
        
        if (complaints.length === 0) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        res.json(complaints[0]);
    } catch (error) {
        console.error('Error searching complaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;