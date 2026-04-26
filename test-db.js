const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'next-app/.env' });

async function test() {
    console.log('Testing connection to:', process.env.MYSQL_HOST);
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
        console.log('SUCCESS: Connected to database');
        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
        console.error('Code:', err.code);
    }
}

test();
