import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Lock, ShieldCheck, X } from 'lucide-react';
import config from '../config';
import './AdminDashboard.css';

const API = config.API_URL;

export default function AdminDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem('admin_token');
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const [activeTab, setActiveTab] = useState('info');
    const [info, setInfo] = useState(null);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!token) navigate('/admin');
    }, [token]);

    useEffect(() => {
        fetch(`${API}/public/data`)
            .then(r => r.json())
            .then(d => {
                setInfo(d.personalInfo);
                setSkills(d.skills);
                setProjects(d.projects);
            });
        fetch(`${API}/admin/messages`, { headers })
            .then(r => r.json())
            .then(setMessages)
            .catch(() => { });
    }, []);

    const logout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleFileUpload = async (file, type, index = null) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        const uploadId = toast.loading('Syncing media to server...');
        try {
            const res = await fetch(`${API}/admin/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                const fullUrl = `${config.API_URL.replace('/api', '')}${data.url}`;
                if (type === 'profile') {
                    setInfo(prev => ({ ...prev, profile_image: fullUrl }));
                } else if (type === 'project') {
                    const updated = [...projects];
                    updated[index].image_url = fullUrl;
                    setProjects(updated);
                } else if (type === 'skill') {
                    const updated = [...skills];
                    updated[index].icon_url = fullUrl;
                    setSkills(updated);
                }
                toast.success('Media synced successfully', { id: uploadId });
            } else {
                toast.error(data.error || 'Upload failed', { id: uploadId });
            }
        } catch (err) {
            toast.error('Network error during upload', { id: uploadId });
        }
    };

    const saveInfo = async () => {
        const res = await fetch(`${API}/admin/personal_info`, { method: 'PUT', headers, body: JSON.stringify(info) });
        if (res.ok) toast.success('Profile specs updated');
        else toast.error('Verification failed');
    };

    const saveSkills = async () => {
        const res = await fetch(`${API}/admin/skills`, { method: 'PUT', headers, body: JSON.stringify(skills) });
        if (res.ok) toast.success('Core modules synced');
        else toast.error('Sync failed');
    };

    const saveProjects = async () => {
        const res = await fetch(`${API}/admin/projects`, { method: 'PUT', headers, body: JSON.stringify(projects) });
        if (res.ok) toast.success('Endpoints successfully mapped');
        else toast.error('Mapping failed');
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        const res = await fetch(`${API}/admin/password`, { method: 'PUT', headers, body: JSON.stringify({ newPassword }) });
        const data = await res.json();
        if (res.ok) {
            toast.success('Security protocols updated');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error(data.error || 'Update rejected');
        }
    };

    const updateSkillLevel = (index, value) => {
        const updated = [...skills];
        updated[index].level = Number(value);
        setSkills(updated);
    };

    const handleInfoChange = (field, value) => setInfo(prev => ({ ...prev, [field]: value }));

    const TABS = ['info', 'skills', 'projects', 'messages', 'settings'];

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <nav className="admin-sidebar">
                <div className="admin-sidebar-title">~/portfolio/admin</div>
                <ul className="admin-nav">
                    {TABS.map(tab => (
                        <li key={tab}>
                            <button
                                className={`admin-nav-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                ./{tab}
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="admin-logout-btn" onClick={logout}>Disconnect</button>
            </nav>

            {/* Main Content */}
            <main className="admin-main">

                {/* PERSONAL INFO */}
                {activeTab === 'info' && info && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="admin-section-title">Personal Information</h2>
                        <div className="admin-card">
                            <div className="admin-form-grid">
                                {['name', 'title', 'tagline', 'email', 'github', 'linkedin'].map(field => (
                                    <div key={field} className={`admin-field ${['tagline', 'title'].includes(field) ? 'admin-field-full' : ''}`}>
                                        <label className="admin-label">{field}</label>
                                        <input className="admin-input" value={info[field] || ''} onChange={e => handleInfoChange(field, e.target.value)} />
                                    </div>
                                ))}
                                <div className="admin-field admin-field-full">
                                    <label className="admin-label">about</label>
                                    <textarea className="admin-textarea" value={info.about || ''} onChange={e => handleInfoChange('about', e.target.value)} />
                                </div>
                                <div className="admin-field admin-field-full">
                                    <label className="admin-label">profile image</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        {info.profile_image && (
                                            <img src={info.profile_image} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-cyan)' }} />
                                        )}
                                        <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'profile')} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>
                            </div>
                            <button className="admin-save-btn" onClick={saveInfo}>{'>'} Save Changes</button>
                        </div>
                    </motion.div>
                )}

                {/* SKILLS */}
                {activeTab === 'skills' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="admin-section-title">Skills / Core Modules</h2>
                        <div className="admin-card">
                            <div className="admin-skills-list">
                                {skills.map((skill, i) => (
                                    <div key={skill.id || i} className="admin-skill-row">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            {skill.icon_url && <img src={skill.icon_url} alt="Icon" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />}
                                            <input className="admin-input" value={skill.name} onChange={e => { const u = [...skills]; u[i].name = e.target.value; setSkills(u); }} placeholder="Skill name" />
                                        </div>
                                        <input className="admin-input" value={skill.category} onChange={e => { const u = [...skills]; u[i].category = e.target.value; setSkills(u); }} placeholder="Category" />
                                        <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'skill', i)} style={{ fontSize: '0.7rem' }} />
                                        <button className="admin-delete-btn" onClick={() => setSkills(skills.filter((_, j) => j !== i))}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button className="admin-add-btn" onClick={() => setSkills([...skills, { name: '', category: '', level: 80 }])}>+ Add Skill</button>
                                <button className="admin-save-btn" onClick={saveSkills}>{'>'} Save to Database</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* PROJECTS */}
                {activeTab === 'projects' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="admin-section-title">Projects</h2>
                        <div className="admin-projects-list">
                            {projects.map((proj, i) => (
                                <div key={proj.id || i} className="admin-project-card">
                                    <div className="admin-project-header">
                                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>Project #{i + 1}</span>
                                        <button className="admin-delete-btn" onClick={() => setProjects(projects.filter((_, j) => j !== i))}>✕ Remove</button>
                                    </div>
                                    <div className="admin-form-grid">
                                        <div className="admin-field admin-field-full">
                                            <label className="admin-label">title</label>
                                            <input className="admin-input" value={proj.title} onChange={e => { const u = [...projects]; u[i].title = e.target.value; setProjects(u); }} />
                                        </div>
                                        <div className="admin-field admin-field-full">
                                            <label className="admin-label">description</label>
                                            <textarea className="admin-textarea" value={proj.description} onChange={e => { const u = [...projects]; u[i].description = e.target.value; setProjects(u); }} />
                                        </div>
                                        <div className="admin-field">
                                            <label className="admin-label">technologies (comma-separated)</label>
                                            <input className="admin-input" value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies} onChange={e => { const u = [...projects]; u[i].technologies = e.target.value.split(',').map(s => s.trim()); setProjects(u); }} />
                                        </div>
                                        <div className="admin-field">
                                            <label className="admin-label">link</label>
                                            <input className="admin-input" value={proj.link} onChange={e => { const u = [...projects]; u[i].link = e.target.value; setProjects(u); }} />
                                        </div>
                                        <div className="admin-field admin-field-full">
                                            <label className="admin-label">project image</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                {proj.image_url && (
                                                    <img src={proj.image_url} alt="Project" style={{ width: '120px', height: '70px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} />
                                                )}
                                                <input type="file" onChange={e => handleFileUpload(e.target.files[0], 'project', i)} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button className="admin-add-btn" onClick={() => setProjects([...projects, { title: '', description: '', technologies: [], link: '#', status: '200 OK' }])}>+ Add Project</button>
                            <button className="admin-save-btn" onClick={saveProjects}>{'>'} Save to Database</button>
                        </div>
                    </motion.div>
                )}

                {/* MESSAGES */}
                {activeTab === 'messages' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="admin-section-title">Incoming Messages</h2>
                        {messages.length === 0 && (
                            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>No messages yet.</p>
                        )}
                        <div className="admin-messages-list">
                            {messages.map(msg => (
                                <div key={msg.id} className="admin-message-card">
                                    <div className="admin-message-meta">
                                        <span>{msg.sender_name}</span> — {msg.reply_to} — {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                    <p style={{ color: 'var(--text-main)' }}>{msg.payload}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* SETTINGS */}
                {activeTab === 'settings' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="admin-section-title">Settings</h2>
                        <div className="admin-card">
                            <h3 style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={18} /> Change Admin Password
                            </h3>
                            <form onSubmit={changePassword} className="admin-password-form">
                                <div className="admin-field" style={{ maxWidth: '400px', marginBottom: '1.2rem' }}>
                                    <label className="admin-label">New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="admin-input"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Min 6 characters"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="admin-field" style={{ maxWidth: '400px', marginBottom: '1.2rem' }}>
                                    <label className="admin-label">Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="admin-input"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat new password"
                                            required
                                        />
                                        <div className="password-match-icon">
                                            {confirmPassword && (confirmPassword === newPassword ? <ShieldCheck size={18} color="#4ade80" /> : <X size={18} color="#ff5f56" />)}
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="admin-save-btn">{'>'} Update Security Protocols</button>
                            </form>
                        </div>
                    </motion.div>
                )}

            </main>
        </div>
    );
}
