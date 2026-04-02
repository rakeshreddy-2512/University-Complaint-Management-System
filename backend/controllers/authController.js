const db = require('../config/database');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Get user with department
        const [users] = await db.query(
            `SELECT u.id, u.name, u.email, u.password, u.role,
                    d.name as department
             FROM users u
             LEFT JOIN staff_departments sd ON u.id = sd.staff_id
             LEFT JOIN departments d ON sd.department_id = d.id
             WHERE u.email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        
        // Compare passwords directly (plain text)
        const isValidPassword = (password === user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role, 
                name: user.name, 
                department: user.department
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.name, u.email, u.role,
                    d.name as department
             FROM users u
             LEFT JOIN staff_departments sd ON u.id = sd.staff_id
             LEFT JOIN departments d ON sd.department_id = d.id
             WHERE u.id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, getCurrentUser };