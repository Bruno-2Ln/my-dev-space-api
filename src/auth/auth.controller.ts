import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email et mot de passe requis' });
            return;
        }

        const token = await AuthService.login(email, password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: 'Connexion réussie' });
    } catch (err) {
        res.status(401).json({ message: 'Identifiants invalides' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({ message: 'Déconnexion réussie'});
};