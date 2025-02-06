// src/UpdateEmployee.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEmployee = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState('');
    const { id } = useParams();  // Get the employee ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch employee details using the ID
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/employees/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                const employee = response.data;
                setName(employee.name);
                setRole(employee.role);
                setDepartment(employee.department);
                setSalary(employee.salary);
            } catch (err) {
                setError('Error fetching employee');
                console.error(err);
            }
        };

        fetchEmployee();
    }, [id]);  // Fetch employee details when component mounts

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !role || !department || !salary) {
            setError('Please fill in all fields');
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in to update an employee');
            return;
        }

        // Send request to update employee
        axios.put(`http://localhost:5000/api/employees/${id}`, 
            { name, role, department, salary }, 
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => {
                navigate('/');
            })
            .catch(err => {
                setError(`Error updating employee: ${err.message}`);
                console.error(err);
            });
    };

    return (
        <div>
            <h2>Update Employee</h2>
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
                <button type="submit">Update Employee</button>
            </form>
        </div>
    );
};

export default UpdateEmployee;
