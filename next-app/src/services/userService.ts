import pool from '@/lib/db';
import { hash, genSalt } from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    department_id: number | null;
    created_at: Date;
}

export class UserService {
    static async getAllUsers(): Promise<User[]> {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT id, username, name, email, department_id, created_at
            FROM users
            WHERE deleted_at IS NULL
            ORDER BY created_at DESC
        `);
        return rows as User[];
    }

    static async createUser(userData: {
        username: string;
        password?: string;
        name: string;
        email?: string;
        department_id?: number | null;
    }): Promise<number> {
        const { username, password = 'password123', name, email = '', department_id = null } = userData;

        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(`
            INSERT INTO users (username, password, name, email, department_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        `, [username, passwordHash, name, email, department_id]);

        return result.insertId;
    }

    static async resetPassword(userId: number, newPassword: string = 'password123'): Promise<boolean> {
        const salt = await genSalt(10);
        const passwordHash = await hash(newPassword, salt);

        const [result] = await pool.query<ResultSetHeader>(`
            UPDATE users
            SET password = ?, updated_at = NOW()
            WHERE id = ?
        `, [passwordHash, userId]);

        return result.affectedRows > 0;
    }

    static async deleteUser(userId: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(`
            UPDATE users
            SET deleted_at = NOW()
            WHERE id = ?
        `, [userId]);
        return result.affectedRows > 0;
    }
}
