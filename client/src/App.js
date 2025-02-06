// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import UpdateEmployee from './UpdateEmployee';
import Login from './Login';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="App">
            <h1>Salary Management System</h1>
            <nav>
                <ul>
                    {isAuthenticated ? (
                        <>
                            <li><Link to="/">Employee List</Link></li>
                            <li><Link to="/add">Add New Employee</Link></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    ) : (
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </nav>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={isAuthenticated ? <EmployeeList /> : <Login />} />
                <Route path="/add" element={isAuthenticated ? <AddEmployee /> : <Login />} />
                <Route path="/update/:id" element={isAuthenticated ? <UpdateEmployee /> : <Login />} />
            </Routes>
        </div>
    );
}

export default App;
