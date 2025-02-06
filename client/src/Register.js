// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Send registration request to the backend
        axios.post('http://localhost:5000/api/auth/register', { name, email, password })
            .then((response) => {
                // Handle success (store token or show success message)
                localStorage.setItem('authToken', response.data.token);
                navigate('/'); // Redirect to home page
            })
            .catch((err) => {
                setError('Registration failed');
                console.error(err);
            });
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
