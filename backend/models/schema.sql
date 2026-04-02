-- Create Database
CREATE DATABASE IF NOT EXISTS complaint_system;
USE complaint_system;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'student') NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Department Assignments
CREATE TABLE IF NOT EXISTS staff_departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (staff_id, department_id)
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    student_id INT NOT NULL,
    assigned_staff_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert Sample Data
-- Insert Departments
INSERT INTO departments (name, description) VALUES 
('WiFi', 'WiFi and internet connectivity issues'),
('Classroom', 'Classroom facilities and equipment'),
('Hostel', 'Hostel accommodation issues'),
('Library', 'Library services and resources'),
('Maintenance', 'General maintenance and repairs');

-- Insert Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@university.com', '$2a$10$rQKJQ8XqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLq', 'admin');

-- Insert Staff Users (password: staff123)
INSERT INTO users (name, email, password, role) VALUES 
('puneeth', 'puneeth@university.com', '$2a$10$rQKJQ8XqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLq', 'staff');

-- Insert Student Users (password: student123)
INSERT INTO users (name, email, password, role) VALUES 
('jyotir', 'jyotir@university.com', '$2a$10$rQKJQ8XqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLqLq', 'student');

-- Assign staff to departments
INSERT INTO staff_departments (staff_id, department_id) VALUES 
(2, 1); -- puneeth assigned to WiFi department