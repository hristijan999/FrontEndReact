// Login.tsx
import React, { useState } from 'react';
import { LogIn  } from "../api/login.ts";
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";





const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { refreshUser } = useUser();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await LogIn(username, password);
            await refreshUser();

            window.location.href = '/eshop';
        } catch (err) {
            setError('Invalid credentials to e');
        }
    };
    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="error">{error}</div>}
                <div>
                    <label>Email</label>
                    <input type="email" value={username}
                           onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password}
                           onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="d-flex flex-column flex-md-row  gap-5">
                    <button className={`btn btn-primary me-5`} type="submit">Login</button>
                    <button type="button" onClick={() => navigate("/register")} className={`btn btn-secondary`}>Register</button>
                </div>

            </form>

        </div>
    );

};

export default Login;