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
                db.run(`INSERT INTO personal_info (name, title, tagline, about, email, github, linkedin, profile_image) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        "Haile", 
                        "Backend Engineer & Systems Architect", 
                        "Engineering high-performance backends, resilient APIs, and seamless digital experiences.", 
                        "I am a Full-Stack Software Engineer with a passion for building scalable, secure, and intuitive systems. With deep expertise in Node.js, Python, and cloud infrastructure, I focus on the underlying architecture that makes modern web applications fast and reliable.", 
                        "hailemeskel.getaneh@outlook.com", 
                        "https://github.com/hailemeskel-getaneh", 
                        "https://linkedin.com/in/hailemeskel-getaneh",
                        "/uploads/haile.png"
                    ]
                );

                // Seed Skills
                const skills = [
                    ["Node.js", "Runtime", 95, "/uploads/nodejs.png"],
                    ["Python", "Language", 88, "/uploads/python.png"],
                    ["React", "Frontend", 92, "/uploads/react.png"],
                    ["PostgreSQL", "Database", 90, "/uploads/postgres.png"],
                    ["MongoDB", "Database", 85, "/uploads/mongo.png"],
                    ["Docker", "DevOps", 88, "/uploads/docker.png"]
                ];
                const stmt = db.prepare(`INSERT INTO skills (name, category, level, icon_url) VALUES (?, ?, ?, ?)`);
                skills.forEach(skill => stmt.run(skill));
                stmt.finalize();


                // Seed Projects
                const projects = [
                    ["wanderEthio", "A comprehensive tourism platform designed to enhance the travel experience in Ethiopia with seamless registration and booking.", "JavaScript, Node.js, Express, MongoDB", "https://github.com/hailemeskel-getaneh/wanderEthio", "PUBLIC"],
                    ["gitglow", "A premium GitHub statistics generator that creates dynamic, glassmorphism-inspired SVG cards for profile READMEs.", "JavaScript, SVG, GitHub API, Node.js", "https://github.com/hailemeskel-getaneh/gitglow", "STABLE"],
                    ["brainbox", "A lightweight web application designed to help you capture, organize, and manage thoughts, topics, and notes.", "TypeScript, React, Node.js, Express", "https://github.com/hailemeskel-getaneh/brainbox", "PUBLIC"],
                    ["QuizApp", "A MERN stack quiz application with a timer and an admin panel for managing users and questions.", "JavaScript, React, Node.js, MongoDB", "https://github.com/hailemeskel-getaneh/QuizApp", "PUBLIC"],
                    ["ethco-ai", "An AI-powered platform for Ethiopian context, leveraging modern machine learning and TypeScript.", "TypeScript, React, Tailwind, Python", "https://github.com/hailemeskel-getaneh/ethco-ai", "STABLE"]
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
