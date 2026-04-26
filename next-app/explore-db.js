import pool from './src/lib/db.js';

async function explore() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        console.log('Tables:', tables);

        const [departments] = await pool.query('SELECT * FROM department');
        console.log('Departments:', departments);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

explore();
