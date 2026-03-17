const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Path to persistent data folder
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
    db.serialize(() => {
        // 1. Create Admin Table
        db.run(`CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

        // 2. Create Personal Info Table
        db.run(`CREATE TABLE IF NOT EXISTS personal_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      title TEXT,
      tagline TEXT,
      about TEXT,
      email TEXT,
      github TEXT,
      linkedin TEXT,
      profile_image TEXT
    )`, () => {
            // Migration: Add profile_image if table existed without it
            db.run(`ALTER TABLE personal_info ADD COLUMN profile_image TEXT`, (err) => {
                if (err) { /* Column probably exists */ }
            });
        });

        // 3. Create Skills Table
        db.run(`CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            level INTEGER,
            icon_url TEXT
        )`, () => {
            // Migration: Add icon_url if table existed without it
            db.run(`ALTER TABLE skills ADD COLUMN icon_url TEXT`, (err) => {
                if (err) {
                    // Column probably exists, ignore
                }
            });
        });

        // 4. Create Projects Table
        db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      technologies TEXT,
      link TEXT,
      status TEXT,
      image_url TEXT
    )`, () => {
            // Migration: Add image_url if table existed without it
            db.run(`ALTER TABLE projects ADD COLUMN image_url TEXT`, (err) => {
                if (err) { /* Column probably exists */ }
            });
        });

        // 5. Create Messages Table
        db.run(`CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_name TEXT,
      reply_to TEXT,
      payload TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Seed Data if Personal Info is empty
        db.get('SELECT COUNT(*) as count FROM personal_info', (err, row) => {
            if (row && row.count === 0) {
                console.log('[SYS] Database fresh. Seeding initial dynamic data...');

                // Seed Admin (Default: admin / password123)
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync('password123', salt);
                db.run(`INSERT INTO admin (username, password) VALUES (?, ?)`, ['admin', hash]);

                // Seed Personal Info
                db.run(`INSERT INTO personal_info (name, title, tagline, about, email, github, linkedin) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    ["Haile", "Software Developer & Systems Architect", "Building scalable logic, robust APIs, and optimizing data flow.", "I specialize in creating efficient, secure, and highly available systems across the stack. While others focus on the surface, I engineer the core mechanisms that power the web.", "contact@haile.dev", "https://github.com/haile", "https://linkedin.com/in/haile"]
                );

                // Seed Skills
                const skills = [
                    ["Node.js", "Backend", 90],
                    ["Python", "Backend", 85],
                    ["Go", "Backend", 75],
                    ["PostgreSQL", "Database", 88],
                    ["Docker", "DevOps", 85],
                    ["React", "Frontend", 80]
                ];
                const stmt = db.prepare(`INSERT INTO skills (name, category, level) VALUES (?, ?, ?)`);
                skills.forEach(skill => stmt.run(skill));
                stmt.finalize();

                // Seed Projects
                const projects = [
                    ["Auth Gateway Microservice", "A centralized JWT authentication service handling 10k+ requests per minute.", "Go, Redis, Docker", "#", "200 OK"],
                    ["Real-time Data Pipeline", "WebSocket-based streaming data pipeline processing market data in real-time.", "Node.js, Socket.io, PostgreSQL", "#", "200 OK"]
                ];
                const projStmt = db.prepare(`INSERT INTO projects (title, description, technologies, link, status) VALUES (?, ?, ?, ?, ?)`);
                projects.forEach(proj => projStmt.run(proj));
                projStmt.finalize();
            }
        });
    });
};

module.exports = {
    db,
    initializeDatabase
};
