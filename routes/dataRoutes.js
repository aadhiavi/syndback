const express = require('express');
const Employee = require('../models/employee');
const router = express.Router();

// Create
router.post('/post-data', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all
router.get('/get-data', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error fetching employee data:', err);
        res.status(400).json({ message: err.message });
    }
});

// Get by ID
router.get('/get-data/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Data fetched successfully', employee });
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit details
router.patch('/edit-data/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        console.error('Error updating employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete employee
router.delete('/delete-data/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

