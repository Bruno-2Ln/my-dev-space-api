import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    status?: number;
}

export const errorMiddleware = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    console.error(`[ERROR] ${status} - ${message}`);

    res.status(status).json({ status, message });
};