import {Router, Response, Request} from "express";
import {login, logout} from "./auth.controller";
import { requireAuth, requireAdmin, AuthRequest } from './auth.middleware';

export const authRouter = Router();

authRouter.get('/me', requireAuth, requireAdmin, (req: AuthRequest, res: Response) => {
    const authReq = req as AuthRequest;
    res.json({ userId: authReq.user?.userId, role: authReq.user?.role });
});


authRouter.post('/login', login);
authRouter.post('/logout', logout);