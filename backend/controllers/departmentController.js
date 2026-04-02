const db = require('../config/database');

// Get all departments
const getDepartments = async (req, res) => {
    try {
        const [departments] = await db.query(
            'SELECT id, name, description, created_at FROM departments ORDER BY name'
        );

        // Get staff assigned to each department
        for (let dept of departments) {
            const [staff] = await db.query(
                `SELECT u.id, u.name, u.email 
                 FROM users u
                 JOIN staff_departments sd ON u.id = sd.staff_id
                 WHERE sd.department_id = ?`,
                [dept.id]
            );
            dept.staff = staff;
        }

        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create department
const createDepartment = async (req, res) => {
    try {
        const { name, description } = req.body;

        const [result] = await db.query(
            'INSERT INTO departments (name, description) VALUES (?, ?)',
            [name, description || null]
        );

        res.status(201).json({ message: 'Department created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating department:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Department name already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete department
const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM departments WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDepartments,
    createDepartment,
    deleteDepartment
};