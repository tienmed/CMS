import mysql from 'mysql2/promise';

const requiredEnvVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    const errorMsg = `DATABASE CONFIGURATION ERROR: Missing environment variables: ${missingEnvVars.join(', ')}`;
    console.error(errorMsg);
}

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'cms',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 seconds timeout
});

export const withTransaction = async <T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const testConnection = async (): Promise<{ success: boolean; error?: string; code?: string }> => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        return { success: true };
    } catch (error: any) {
        console.error('Database Connection Failure:', {
            message: error.message,
            code: error.code,
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER
        });
        return { success: false, error: error.message, code: error.code };
    }
};

export default pool;
