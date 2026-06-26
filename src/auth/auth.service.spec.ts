import { AuthService } from './auth.service';
import prisma from '../db/prisma.client';
import bcrypt from 'bcrypt';

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
        }
    }
}));


describe('Auth Service', () => {
    let hashedPassword: string;

    beforeAll(async () => {
        jest.clearAllMocks();
        hashedPassword = await bcrypt.hash('motDePasseClair', 10);
    });

   it('should return a token for valid credentials', async () => {
       (prisma.user.findUnique as jest.Mock).mockResolvedValue({
           id: 1,
           email: 'admin@test.com',
           password: hashedPassword,
           role: 'ADMIN'
       });

       const token = await AuthService.login('admin@test.com', 'motDePasseClair');

       expect(token).toBeDefined();
       expect(typeof token).toBe('string');
   })

    it('should throw an error for non-existent user', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(AuthService.login('inconnu@test.com', 'whatever'))
            .rejects.toThrow('Identifiants invalides');
    });

    it('should throw an error for wrong password', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'ADMIN',
        });

        await expect(AuthService.login('admin@test.com', 'mauvaisMotDePasse'))
            .rejects.toThrow('Identifiants invalides');
    });
})