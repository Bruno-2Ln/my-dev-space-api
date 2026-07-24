import {NextFunction, Response, Request} from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: number; role: string};
    cookies: { [key: string]: string };
}

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authReq = req as AuthRequest;
    const token = authReq.cookies?.token;

    if (!token) {
        res.status(401).json({ message: 'Non authentifié'});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
        authReq.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Toekn invalide ou expiré' });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authReq = req as AuthRequest;
    if (authReq.user?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Accès refusé' });
        return;
    }
    next();
};