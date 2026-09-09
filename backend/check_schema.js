require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name IN ('reviews', 'enrollments', 'course_progress', 'courses', 'lessons') 
    ORDER BY table_name, ordinal_position
  `);
  console.table(res.rows);
  await client.end();
}
run().catch(console.error);

