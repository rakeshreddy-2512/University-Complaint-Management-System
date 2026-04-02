const express = require('express');
const {
    getDepartments,
    createDepartment,
    deleteDepartment
} = require('../controllers/departmentController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', authenticateToken, getDepartments);
router.post('/', authenticateToken, checkRole('admin'), createDepartment);
router.delete('/:id', authenticateToken, checkRole('admin'), deleteDepartment);

module.exports = router;