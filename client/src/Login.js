import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState(''); // Renaming 'username' to 'email'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both email and password');
            return;
        }

        // Sending email instead of username
        axios.post('http://localhost:5000/api/auth/login', { email: username, password })
            .then(response => {
                localStorage.setItem('authToken', response.data.token);
                navigate('/');
            })
            .catch(err => {
                console.error('Login error:', err.response ? err.response.data : err.message);
                setError('Invalid credentials');
            });
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    value={username}  // Email field
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
