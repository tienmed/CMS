import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load env from next-app so we don't duplicate credentials
dotenv.config({ path: path.resolve(__dirname, '../../next-app/.env.local') });
const requiredEnv = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DATABASE'];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required database environment variable: ${key}`);
    }
}
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
export default pool;
//# sourceMappingURL=db.js.map