const express = require('express');
const {
    getDashboardStats,
    getStaffStats,
    getStudentStats
} = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/dashboard', authenticateToken, checkRole('admin'), getDashboardStats);
router.get('/staff-stats', authenticateToken, checkRole('staff'), getStaffStats);
router.get('/student-stats', authenticateToken, checkRole('student'), getStudentStats);

module.exports = router;