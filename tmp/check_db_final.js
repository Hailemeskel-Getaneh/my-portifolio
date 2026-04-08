const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../backend/data/portfolio.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT * FROM projects', (err, rows) => {
    if (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
    console.log('--- PROJECTS ---');
    console.log(JSON.stringify(rows));
    db.close();
});
