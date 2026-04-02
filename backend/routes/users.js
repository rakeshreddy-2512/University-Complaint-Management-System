const express = require('express');
const {
    getUsers,
    createUser,
    deleteUser,
    assignStaffToDepartment
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Admin only routes
router.get('/', checkRole('admin'), getUsers);
router.post('/', checkRole('admin'), createUser);
router.delete('/:id', checkRole('admin'), deleteUser);
router.post('/assign-department', checkRole('admin'), assignStaffToDepartment);

module.exports = router;