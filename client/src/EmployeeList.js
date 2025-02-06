// src/EmployeeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:5000/api/employees', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setEmployees(response.data);
                setFilteredEmployees(response.data);
            })
            .catch(err => {
                setError('Error fetching employees.');
                console.error('Error fetching employees:', err);
            });
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5000/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedEmployees = employees.filter(employee => employee._id !== id);
            setEmployees(updatedEmployees);
            setFilteredEmployees(updatedEmployees);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = employees.filter(employee =>
            employee.name.toLowerCase().includes(term) ||
            employee.role.toLowerCase().includes(term) ||
            employee.department.toLowerCase().includes(term)
        );
        setFilteredEmployees(filtered);
    };

    const handleSort = (criteria) => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortCriteria(criteria);
        setSortOrder(order);

        const sorted = [...filteredEmployees].sort((a, b) => {
            if (criteria === 'name' || criteria === 'department') {
                return order === 'asc'
                    ? a[criteria].localeCompare(b[criteria])
                    : b[criteria].localeCompare(a[criteria]);
            } else if (criteria === 'salary') {
                return order === 'asc' ? a.salary - b.salary : b.salary - a.salary;
            }
            return 0;
        });

        setFilteredEmployees(sorted);
    };

    return (
        <div>
            <h2 className="title">Employee List</h2>
            <div className="search-sort-container">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <button
                    onClick={() => handleSort('name')}
                    className="sort-button name-sort"
                >
                    Sort by Name
                </button>
                <button
                    onClick={() => handleSort('department')}
                    className="sort-button department-sort"
                >
                    Sort by Department
                </button>
                <button
                    onClick={() => handleSort('salary')}
                    className="sort-button salary-sort"
                >
                    Sort by Salary
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            {filteredEmployees.length === 0 ? (
                <p className="no-employees">No employees found.</p>
            ) : (
                <div className="table-container">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th className="table-header">Name</th>
                                <th className="table-header">Role</th>
                                <th className="table-header">Department</th>
                                <th className="table-header">Salary</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(employee => (
                                <tr key={employee._id} className="table-row">
                                    <td className="table-cell">{employee.name}</td>
                                    <td className="table-cell">{employee.role}</td>
                                    <td className="table-cell">{employee.department}</td>
                                    <td className="table-cell">${employee.salary}</td>
                                    <td className="table-cell">
                                        <Link
                                            to={`/update/${employee._id}`}
                                            className="update-button"
                                        >
                                            Update
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(employee._id)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
