import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma.client';

export const AuthService = {
    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            throw new Error('Identifiants invalides');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Identifiants invalides');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '2h'}
        );

        return token;
    }
}