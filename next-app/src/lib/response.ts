export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    code?: string;
    errors?: any;
}

export class ResponseUtil {
    static success<T>(data: T, message?: string): ApiResponse<T> {
        return {
            status: 'success',
            message,
            data
        };
    }

    static error(message: string, code?: string, errors?: any): ApiResponse {
        return {
            status: 'error',
            message,
            code,
            errors
        };
    }
}
