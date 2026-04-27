const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'next-app/.env' });

async function findUser() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        console.log('Connected to database.');

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', ['super_admin']);

        if (rows.length === 0) {
            console.log('User super_admin not found.');
            // Let's check all users to be sure
            const [allUsers] = await connection.execute('SELECT id, username FROM users LIMIT 10');
            console.log('First 10 users:', allUsers);
        } else {
            console.log('User found:', rows[0]);
        }

        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

findUser();
