const express = require('express');
const Employee = require('../models/Employee');
const verifyToken = require('../middleware/authMiddleware'); // Updated import name
const router = express.Router();

// DELETE: Delete an employee by ID
router.delete('/:id', verifyToken, async (req, res) => {
    console.log('Received DELETE request for ID:', req.params.id);
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// POST: Create a new employee
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, role, department, salary } = req.body;

        // Check for missing fields
        if (!name || !role || !department || !salary) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create a new employee record
        const newEmployee = new Employee({ name, role, department, salary });

        // Save the employee record to MongoDB
        await newEmployee.save();
        res.status(201).json(newEmployee);  // Return the created employee object
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// GET: Retrieve all employees
router.get('/', verifyToken,  async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);  // Return all employees
    } catch (err) {
        res.status(400).json({ error: 'Failed to fetch employees' });
    }
});

// PUT: Update an employee by ID
router.put('/:id', verifyToken,  async (req, res) => {
    const { name, role, department, salary } = req.body;
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, role, department, salary },
            { new: true } // Return the updated employee
        );
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update employee' });
    }
});

// src/routes/employeeRoutes.js
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});


// Export the router
module.exports = router;
