const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'next-app/.env' });

async function resetPassword() {
    try {
        const newPassword = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPassword, salt);

        console.log('New Password: ', newPassword);
        console.log('New Hash: ', hash);

        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE username = ?',
            [hash, 'super_admin']
        );

        if (result.affectedRows > 0) {
            console.log('SUCCESS: Password updated for super_admin.');
        } else {
            console.log('ERROR: Could not update password.');
        }

        await connection.end();
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

resetPassword();
