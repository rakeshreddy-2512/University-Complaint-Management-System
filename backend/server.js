const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});