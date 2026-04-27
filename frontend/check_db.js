const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../frontend/.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function checkDb() {
  try {
    console.log('Connecting to database...');
    const res = await pool.query('SELECT current_database()');
    console.log('Connected to:', res.rows[0].current_database);

    console.log('Checking for "users" table...');
    const tableRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableRes.rows[0].exists) {
      console.log('Table "users" exists.');
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users';
      `);
      console.log('Columns:', columns.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));
    } else {
      console.log('Table "users" DOES NOT exist.');
    }
  } catch (err) {
    console.error('Database error:', err.message);
  } finally {
    await pool.end();
  }
}

checkDb();
