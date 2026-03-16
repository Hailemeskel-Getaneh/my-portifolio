import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './AdminLogin.css';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${config.API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            localStorage.setItem('admin_token', data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <motion.div
                className="admin-login-box"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="admin-login-logo">
                    <h2>~/admin</h2>
                    <p>Secure access required</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="login-form-group">
                        <label className="login-form-label">const username =</label>
                        <input
                            type="text"
                            className="login-form-input"
                            placeholder='"admin";'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label className="login-form-label">const password =</label>
                        <input
                            type="password"
                            className="login-form-input"
                            placeholder='"••••••••";'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? '[Authenticating...]' : '> SSH Connect'}
                    </button>
                    {error && <p className="login-error">Error: {error}</p>}
                </form>
            </motion.div>
        </div>
    );
}
