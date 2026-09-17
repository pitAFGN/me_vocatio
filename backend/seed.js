require('dotenv').config();
const pool = require('./src/config/db');
async function run() {
  try {
    console.log('Seed: no hay datos iniciales que sembrar.');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();

