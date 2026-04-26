import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load env from next-app so we don't duplicate credentials
// On Vercel, process.env is injected directly and this file may not exist.
dotenv.config({ path: path.resolve(__dirname, "../../next-app/.env.local") });
let pool = null;
let poolInitError = null;
function normalizePort(rawPort) {
    if (!rawPort) {
        return undefined;
    }
    const parsedPort = Number(rawPort);
    if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        return null;
    }
    return parsedPort;
}
function parseMysqlUrl(urlString) {
    try {
        const parsed = new URL(urlString);
        if (parsed.protocol !== "mysql:") {
            return null;
        }
        const database = parsed.pathname.replace(/^\//, "");
        if (!parsed.hostname || !parsed.username || !database) {
            return null;
        }
        const normalizedPort = normalizePort(parsed.port || undefined);
        if (normalizedPort === null) {
            return null;
        }
        return {
            host: parsed.hostname,
            user: decodeURIComponent(parsed.username),
            password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
            database,
            port: normalizedPort
        };
    }
    catch {
        return null;
    }
}
function resolveMysqlConfig() {
    const hasDiscreteConfig = process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE;
    if (hasDiscreteConfig) {
        const normalizedPort = normalizePort(process.env.MYSQL_PORT);
        if (normalizedPort === null) {
            poolInitError = "MYSQL_PORT không hợp lệ. Giá trị hợp lệ: số nguyên từ 1-65535.";
            return null;
        }
        return {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: normalizedPort
        };
    }
    const mysqlUrl = process.env.MYSQL_URL ?? process.env.DATABASE_URL;
    if (mysqlUrl) {
        const parsed = parseMysqlUrl(mysqlUrl);
        if (!parsed) {
            poolInitError = "MYSQL_URL/DATABASE_URL không hợp lệ. Định dạng cần là mysql://user:pass@host:3306/database.";
            return null;
        }
        return parsed;
    }
    return null;
}
function getConfigErrorMessage() {
    return "Thiếu cấu hình MySQL. Hãy set MYSQL_HOST/MYSQL_USER/MYSQL_DATABASE hoặc MYSQL_URL (hoặc DATABASE_URL trên Vercel).";
}
export function getPool() {
    if (pool) {
        return pool;
    }
    const config = resolveMysqlConfig();
    if (!config) {
        poolInitError ??= getConfigErrorMessage();
        return null;
    }
    try {
        pool = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            namedPlaceholders: false
        });
        poolInitError = null;
        return pool;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        poolInitError = `Không thể khởi tạo MySQL pool: ${message}`;
        return null;
    }
}
export function getPoolInitError() {
    return poolInitError;
}
//# sourceMappingURL=db.js.map