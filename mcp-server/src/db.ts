import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from next-app so we don't duplicate credentials
dotenv.config({ path: path.resolve(__dirname, "../../next-app/.env.local") });

const requiredEnvKeys = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_DATABASE"] as const;
for (const key of requiredEnvKeys) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: false
});

export default pool;
