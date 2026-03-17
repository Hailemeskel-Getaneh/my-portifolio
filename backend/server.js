const express = require('express');
require('dotenv').config();
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbHelper = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

// Ensure data and upload directories exist
const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(dataDir, 'uploads');
[dataDir, uploadDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Middleware
app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Initialize Database structure and seed default data if empty
dbHelper.initializeDatabase();

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Portfolio API Core Online. Status 200 OK.' });
});

app.listen(PORT, () => {
    console.log(`[SYS] Server initializing on port ${PORT}...`);
    console.log(`[SYS] Backend API ready.`);
});
