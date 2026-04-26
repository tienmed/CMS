import pool from '@/lib/db';
import { AppError } from '@/lib/error';

export interface Department {
    id: number;
    name: string;
}

class DepartmentService {
    private static instance: DepartmentService;

    private constructor() { }

    public static getInstance(): DepartmentService {
        if (!DepartmentService.instance) {
            DepartmentService.instance = new DepartmentService();
        }
        return DepartmentService.instance;
    }

    async getAllDepartments(): Promise<Department[]> {
        try {
            const [rows] = await pool.query('SELECT id, name FROM department WHERE deleted_at IS NULL ORDER BY name');
            return rows as Department[];
        } catch (err) {
            throw new AppError('Không thể lấy danh sách bộ môn', 500, 'DB_QUERY_ERROR');
        }
    }
}

export const departmentService = DepartmentService.getInstance();
