import {Router} from "express";
import {login, logout} from "./auth.controller";
import { requireAuth, requireAdmin, AuthRequest } from './auth.middleware';

export const authRouter = Router();

authRouter.get('/me', requireAuth, requireAdmin, (req: AuthRequest, res) => {
    res.json({ userId: req.user?.userId, role: req.user?.role });
});


authRouter.post('/login', login);
authRouter.post('/logout', logout);