// Login.tsx
import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import './Login.css';
import { Register } from "../api/login";
const RegisterPage = () => {

    const navigate = useNavigate();

    const [Email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordd, setPasswordd] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Registering...");
        try {
            const res = await Register(Email, password);
            console.log("Register success:", res.data);
            navigate("/logIn");

        } catch (err) {
            console.error("Register failed:", err);
            setError('Invalid credentials');
            if (axios.isAxiosError(err)) {
                console.error("Response data:", err.response?.data);
                console.error("Status code:", err.response?.status);
                console.error("Headers:", err.response?.headers);
            }
        }
    };


    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <div className="error">{error}</div>}
                <div>
                    <label>Email</label>
                    <input type="email" value={Email}
                           onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password}
                           onChange={e => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={passwordd}
                           onChange={e => setPasswordd(e.target.value)} required />
                </div>
                {passwordd && password !== passwordd && (
                    <div className="text-danger mt-2">Passwords do not match</div>
                )}
                {passwordd && password === passwordd && (
                    <div className="text-success mt-2">Passwords match ✅</div>
                )}

                    <button type={"submit"} className={`btn btn-primary  `}>Register</button>
            </form>

        </div>
    );

};

export default RegisterPage;