const db = require('../config/database');

const getDashboardStats = async (req, res) => {
    try {
        // Get all complaints
        const [allComplaints] = await db.query('SELECT COUNT(*) as count FROM complaints');
        const [pending] = await db.query('SELECT COUNT(*) as count FROM complaints WHERE status = "pending"');
        const [inProgress] = await db.query('SELECT COUNT(*) as count FROM complaints WHERE status = "in_progress"');
        const [resolved] = await db.query('SELECT COUNT(*) as count FROM complaints WHERE status = "resolved"');

        // Get complaints by category
        const [categoryStats] = await db.query(
            `SELECT category, COUNT(*) as count 
             FROM complaints 
             GROUP BY category`
        );

        // Get complaints by status
        const [statusStats] = await db.query(
            `SELECT status, COUNT(*) as count 
             FROM complaints 
             GROUP BY status`
        );

        // Get recent complaints
        const [recentComplaints] = await db.query(
            `SELECT c.id, c.title, c.category, c.status, 
                    DATE_FORMAT(c.created_at, '%m/%d/%Y') as date,
                    u.name as student_name
             FROM complaints c
             JOIN users u ON c.student_id = u.id
             ORDER BY c.created_at DESC
             LIMIT 5`
        );

        res.json({
            total: allComplaints[0].count,
            pending: pending[0].count,
            inProgress: inProgress[0].count,
            resolved: resolved[0].count,
            categoryStats,
            statusStats,
            recentComplaints
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getStaffStats = async (req, res) => {
    try {
        const staffId = req.user.id;

        const [assigned] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE assigned_staff_id = ?',
            [staffId]
        );

        const [pending] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE assigned_staff_id = ? AND status = "pending"',
            [staffId]
        );

        const [inProgress] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE assigned_staff_id = ? AND status = "in_progress"',
            [staffId]
        );

        const [resolved] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE assigned_staff_id = ? AND status = "resolved"',
            [staffId]
        );

        res.json({
            assigned: assigned[0].count,
            pending: pending[0].count,
            inProgress: inProgress[0].count,
            resolved: resolved[0].count
        });
    } catch (error) {
        console.error('Error fetching staff stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getStudentStats = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [total] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE student_id = ?',
            [studentId]
        );

        const [pending] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE student_id = ? AND status = "pending"',
            [studentId]
        );

        const [inProgress] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE student_id = ? AND status = "in_progress"',
            [studentId]
        );

        const [resolved] = await db.query(
            'SELECT COUNT(*) as count FROM complaints WHERE student_id = ? AND status = "resolved"',
            [studentId]
        );

        res.json({
            total: total[0].count,
            pending: pending[0].count,
            inProgress: inProgress[0].count,
            resolved: resolved[0].count
        });
    } catch (error) {
        console.error('Error fetching student stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboardStats,
    getStaffStats,
    getStudentStats
};