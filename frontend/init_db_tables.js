const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDb() {
  try {
    console.log('Connecting to database...');
    const sql = fs.readFileSync(path.join(__dirname, '../database_init.sql'), 'utf8');
    
    console.log('Executing SQL script...');
    await pool.query(sql);
    
    console.log('Database tables initialized successfully!');
  } catch (err) {
    console.error('Initialization error:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();
