// src/AddEmployee.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !role || !department || !salary) {
            setError('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to add an employee');
            return;
        }

        // Send request to the backend with token in the header
        axios.post('http://localhost:5000/api/employees', 
            { name, role, department, salary }, 
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => {
                navigate('/');
            })
            .catch(err => {
                setError(`Error adding employee: ${err.message}`);
                console.error(err);
            });
    };

    return (
        <div>
            <h2>Add New Employee</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                <button type="submit">Add Employee</button>
            </form>
        </div>
    );
};

export default AddEmployee;
