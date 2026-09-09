require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const res1 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses'");
  console.log('COURSES:');
  console.table(res1.rows);
  
  const res2 = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lessons'");
  console.log('LESSONS:');
  console.table(res2.rows);
  await client.end();
}
run().catch(console.error);

