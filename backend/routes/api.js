const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

router.get('/public/data', (req, res) => {
    const result = {};

    db.get('SELECT * FROM personal_info LIMIT 1', (err, infoRow) => {
        if (err) return res.status(500).json({ error: err.message });
        result.personalInfo = infoRow;

        db.all('SELECT * FROM skills', (err, skillRows) => {
            if (err) return res.status(500).json({ error: err.message });
            result.skills = skillRows;

            db.all('SELECT * FROM projects', (err, projRows) => {
                if (err) return res.status(500).json({ error: err.message });

                // Convert tech strings back to arrays for frontend
                const parsedProjects = projRows.map(p => ({
                    ...p,
                    technologies: p.technologies ? p.technologies.split(',').map(s => s.trim()) : []
                }));

                result.projects = parsedProjects;

                result.terminalLogs = [
                    "Establishing secure connection to server...",
                    "Authenticating user credentials...",
                    "Access granted. Loading dynamic backend modules...",
                    "Fetching active projects from database... [OK]",
                    "Initializing core system... [OK]",
                    "System ready. Welcome to the portfolio."
                ];

                res.json(result);
            });
        });
    });
});

router.post('/public/contact', (req, res) => {
    const { sender_name, reply_to, payload } = req.body;
    if (!sender_name || !reply_to || !payload) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    db.run(`INSERT INTO messages (sender_name, reply_to, payload) VALUES (?, ?, ?)`,
        [sender_name, reply_to, payload],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Message securely logged.', id: this.lastID });
        }
    );
});

// -------------------------------------------------------------
// ADMIN Auth
// -------------------------------------------------------------

router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM admin WHERE username = ?', [username], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(400).json({ error: 'Admin not found.' });

        const isMatch = bcrypt.compareSync(password, row.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: row.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, message: 'Auth successful' });
    });
});

// Middleware for Admin protection
const requireAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.adminId = decoded.id;
        next();
    });
};

// -------------------------------------------------------------
// ADMIN Protected Routes
// -------------------------------------------------------------

router.get('/admin/messages', requireAdmin, (req, res) => {
    db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.put('/admin/personal_info', requireAdmin, (req, res) => {
    const { name, title, tagline, about, email, github, linkedin, profile_image } = req.body;
    db.run(`UPDATE personal_info SET name=?, title=?, tagline=?, about=?, email=?, github=?, linkedin=?, profile_image=? WHERE id=1`,
        [name, title, tagline, about, email, github, linkedin, profile_image],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Personal info updated.' });
        }
    );
});

// ── Skills: replace entire list ────────────────────────────────
router.put('/admin/skills', requireAdmin, (req, res) => {
    const skills = req.body; // Array of { id?, name, category, level }
    if (!Array.isArray(skills)) return res.status(400).json({ error: 'Expected an array' });

    db.serialize(() => {
        db.run('DELETE FROM skills', (err) => {
            if (err) return res.status(500).json({ error: err.message });
            const stmt = db.prepare(`INSERT INTO skills (name, category, level, icon_url) VALUES (?, ?, ?, ?)`);
            req.body.forEach(skill => {
                stmt.run(skill.name, skill.category, skill.level, skill.icon_url);
            }); stmt.finalize(() => res.json({ message: 'Skills updated.' }));
        });
    });
});

// ── Projects: replace entire list ──────────────────────────────
router.put('/admin/projects', requireAdmin, (req, res) => {
    const projects = req.body; // Array of project objects
    if (!Array.isArray(projects)) return res.status(400).json({ error: 'Expected an array' });

    db.serialize(() => {
        db.run('DELETE FROM projects', (err) => {
            if (err) return res.status(500).json({ error: err.message });
            const stmt = db.prepare(
                'INSERT INTO projects (title, description, technologies, link, status, image_url) VALUES (?, ?, ?, ?, ?, ?)'
            );
            projects.forEach(p => {
                const tech = Array.isArray(p.technologies)
                    ? p.technologies.join(', ')
                    : (p.technologies || '');
                stmt.run([p.title, p.description, tech, p.link, p.status || '200 OK', p.image_url]);
            });
            stmt.finalize(() => res.json({ message: 'Projects updated.' }));
        });
    });
});

// ── Admin: change password ──────────────────────────────────────
router.put('/admin/password', requireAdmin, (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password too short (min 6 chars).' });
    const hash = require('bcryptjs').hashSync(newPassword, 10);
    db.run('UPDATE admin SET password = ? WHERE id = ?', [hash, req.adminId], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Password updated.' });
    });
});

// ── Admin: File Upload ──────────────────────────────────────────
router.post('/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

module.exports = router;

