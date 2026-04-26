export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode?: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, errorCode?: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handleError = (error: unknown) => {
    if (error instanceof AppError) {
        if (!error.isOperational) {
            console.error('CRITICAL ERROR:', error);
            // Logic for critical error logging
        }
        return {
            message: error.message,
            status: error.statusCode,
            code: error.errorCode
        };
    }

    console.error('UNEXPECTED ERROR:', error);
    return {
        message: 'Đã xảy ra lỗi không mong muốn hệ thống.',
        status: 500,
        code: 'INTERNAL_SERVER_ERROR'
    };
};
