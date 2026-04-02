const db = require('../config/database');

// Get all users with their department (for staff)
const getUsers = async (req, res) => {
    try {
        // Get students (no department)
        const [students] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE role = "student" ORDER BY created_at DESC'
        );
        
        // Get staff with their department name
        const [staff] = await db.query(
            `SELECT u.id, u.name, u.email, u.role, u.created_at, d.name as department
             FROM users u
             LEFT JOIN staff_departments sd ON u.id = sd.staff_id
             LEFT JOIN departments d ON sd.department_id = d.id
             WHERE u.role = 'staff'
             ORDER BY u.created_at DESC`
        );

        res.json({ students, staff });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, departmentId } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email already exists
        const [existing] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Store password as plain text
        const plainPassword = password;

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, plainPassword, role]
        );

        // If user is staff and department is specified, assign them to department
        if (role === 'staff' && departmentId) {
            await db.query(
                'INSERT INTO staff_departments (staff_id, department_id) VALUES (?, ?)',
                [result.insertId, departmentId]
            );
        }

        res.status(201).json({ 
            message: 'User created successfully', 
            userId: result.insertId 
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM users WHERE id = ? AND role != "admin"',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or cannot delete admin' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign staff to department
const assignStaffToDepartment = async (req, res) => {
    try {
        const { staffId, departmentId } = req.body;

        const [result] = await db.query(
            'INSERT INTO staff_departments (staff_id, department_id) VALUES (?, ?)',
            [staffId, departmentId]
        );

        res.json({ message: 'Staff assigned to department successfully' });
    } catch (error) {
        console.error('Error assigning staff:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUsers,
    createUser,
    deleteUser,
    assignStaffToDepartment
};