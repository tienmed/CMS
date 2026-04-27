const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'next-app/.env' });

async function checkSchema() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        console.log('Connected to database.');

        const [columns] = await connection.execute('DESCRIBE equipment_item');
        console.log('Equipment_item columns:', columns.map(c => c.Field));

        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

checkSchema();
