const mongoose = require('mongoose');

// Define the employee schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    attendance: { type: Number, default: 0 }  // Optional: could be used for attendance tracking
});

// Create and export the Employee model
module.exports = mongoose.model('Employee', employeeSchema);
