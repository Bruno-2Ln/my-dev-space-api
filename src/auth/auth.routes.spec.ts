import app from "../app";
import request from "supertest";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import prisma from '../db/prisma.client';

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

describe('GET /api/auth/me', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should return 401 without auth cookie', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });

    it('should return user data with valid cookie', async () => {
        const token = jwt.sign(
            { userId: 1, role: 'ADMIN' },
            process.env.JWT_SECRET!,
            { expiresIn: '2h' }
        );

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', `token=${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ userId: 1, role: 'ADMIN' });
    });

    it('should return 403 if role is not ADMIN', async () => {
        const token = jwt.sign(
            { userId: 2, role: 'USER' },
            process.env.JWT_SECRET!,
            { expiresIn: '2h' }
        );

        const res = await request(app)
            .get('/api/auth/me')
            .set('Cookie', `token=${token}`);

        expect(res.status).toBe(403);
    });

})

describe('POST /api/auth/login', () => {
    let hashedPassword: string;

    beforeEach(async () => {
        jest.clearAllMocks();
        hashedPassword = await bcrypt.hash('motDePasseClair', 10);
    });

    it('should return 400 if email or password is missing', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com'});

        expect(res.status).toBe(400);
    });

    it('should return 200 for valid credentials', async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'bruno-d-34@hotmail.fr',
            password: hashedPassword,
            role: 'ADMIN',
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'bruno-d-34@hotmail.fr' , password: 'motDePasseClair' });

        expect(res.status).toBe(200);
        expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
    });


    it('should return 401 for invalid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'inconnu@test.com', password: 'wrong' });

        expect(res.status).toBe(401);
    });
});

describe('POST /api/auth/logout', () => {
    it('should clear the cookie and return 200', async () => {
        const res = await request(app).post('/api/auth/logout');

        expect(res.status).toBe(200);
        expect(res.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970');
    });
});