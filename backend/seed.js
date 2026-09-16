require('dotenv').config();
const pool = require('./src/config/db');
async function run() {
  try {
    const check = await pool.query("SELECT COUNT(*) FROM official_resources");
    if (parseInt(check.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO official_resources (titulo, tipo, vocacion, estado) VALUES 
        ('Curso Completo de React 2026', 'Curso Video', 'Desarrollo de Software', 'Activo'), 
        ('Clean Code por Robert C. Martin', 'Libro', 'Ingeniería de Software', 'Activo'), 
        ('Figma UI Kit Básico', 'Herramienta', 'Diseño de Producto', 'Borrador')
      `);
      console.log('Initial data inserted!');
    } else {
      console.log('Data already exists.');
    }
  } catch(e) { 
    console.error(e); 
  } finally { 
    pool.end(); 
  }
}
run();

