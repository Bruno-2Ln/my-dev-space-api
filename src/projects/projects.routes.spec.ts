import request from "supertest";
import prisma from '../db/prisma.client';
import app from "../app";
import jwt from 'jsonwebtoken';
import {mockProjects} from "./projects.mock";

const validToken = jwt.sign(
    {userId: 1, role: 'ADMIN'},
    process.env.JWT_SECRET!,
    {expiresIn: '2h'}
);

const invalidToken = jwt.sign(
    {userId: 1, role: 'USER'},
    process.env.JWT_SECRET!,
    {expiresIn: '2h'}
);

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        project: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        }
    }
}));

describe('GET /projects', () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return projects', async () => {
        (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

        const res = await request(app).get('/api/projects');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
    });

    it('should call next with error when service fails', async () => {
        (prisma.project.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/projects');

        expect(res.status).toBe(500);
    });
})

describe('GET /projects/:id', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return project by id', async () => {
        (prisma.project.findUnique as jest.Mock).mockResolvedValue({
            id: 2,
            title: 'BFF Bancaire',
            shortDescription: 'API bancaire',
            description: 'Backend sécurisé Node.js',
            thumbnailUrl: null,
            images: [],
            stack: ['NODEJS'],
            featured: false,
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const res = await request(app).get('/api/projects/2');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('title', 'BFF Bancaire');
    })

    it('should respond with 400 with message [Id invalide]', async () => {
        const res = await request(app).get('/api/projects/test');

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Id invalide');
    })

    it('should call next with error when service fails', async () => {
        (prisma.project.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

        const res = await request(app).get('/api/projects/2');

        expect(res.status).toBe(500);
    });
})

describe('POST /projects', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return project created', async () => {
        (prisma.project.create as jest.Mock).mockResolvedValue({
            id: 2,
            title: 'BFF Bancaire',
            shortDescription: 'API bancaire',
            description: 'Backend sécurisé Node.js',
            thumbnailUrl: null,
            images: [],
            stack: ['NODEJS'],
            featured: false,
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', `token=${validToken}`)
            .send({
                title: 'BFF Bancaire',
                shortDescription: 'API bancaire',
                description: 'Backend sécurisé Node.js',
                thumbnailUrl: null,
                images: [],
                stack: ['NODEJS'],
                featured: false,
                order: 2,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('title', 'BFF Bancaire');
    })

    it('should respond with 401 if no authentified', async () => {
        const res = await request(app)
            .post('/api/projects')
            .send({
                title: 'BFF Bancaire',
            });

        expect(res.status).toBe(401);
    })

    it('should respond with 403 if no authorized', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', `token=${invalidToken}`)
            .send({
                title: 'BFF Bancaire',
            });

        expect(res.status).toBe(403);
    })

    it('should respond with 400 with message [title is required]', async () => {
        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', `token=${validToken}`)
            .send({
                shortDescription: 'API bancaire',
                description: 'Backend sécurisé Node.js',
                thumbnailUrl: null,
                images: [],
                stack: ['NODEJS'],
                featured: false,
                order: 2,
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'title is required');
    })

    it('should call next with error when service fails', async () => {
        (prisma.project.create as jest.Mock).mockRejectedValue(new Error('DB error'));

        const res = await request(app)
            .post('/api/projects')
            .set('Cookie', `token=${validToken}`);

        expect(res.status).toBe(500);
    });
})

describe('DELETE /projects/:id', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and delete project', async () => {
        (prisma.project.delete as jest.Mock).mockResolvedValue(mockProjects[1]);

        const res = await request(app)
            .delete('/api/projects/2')
            .set('Cookie', `token=${validToken}`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 2);
    })

    it('should respond with 401 if no authentified', async () => {
        const res = await request(app)
            .delete('/api/projects/2');

        expect(res.status).toBe(401);
    })

    it('should respond with 403 if no authorized', async () => {
        const res = await request(app)
            .delete('/api/projects/2')
            .set('Cookie', `token=${invalidToken}`)


        expect(res.status).toBe(403);
    })

    it('should respond with 404 with message [project not existing]', async () => {
        (prisma.project.delete as jest.Mock).mockRejectedValue(new Error(''));

        const res = await request(app)
            .delete('/api/projects/2')
            .set('Cookie', `token=${validToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'project not existing');
    });
})

describe('PATCH /projects/:id', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and update project', async () => {
        const updateProject = {...mockProjects[1], title: 'BFF Bancaire update'};
        (prisma.project.update as jest.Mock).mockResolvedValue(updateProject);

        const res = await request(app)
            .patch('/api/projects/2')
            .set('Cookie', `token=${validToken}`)
            .send({title: 'BFF Bancaire update'})

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', 2);
        expect(res.body).toHaveProperty('title', 'BFF Bancaire update');
    })

    it('should respond with 401 if no authentified', async () => {
        const res = await request(app)
            .patch('/api/projects/2');

        expect(res.status).toBe(401);
    })

    it('should respond with 403 if no authorized', async () => {
        const res = await request(app)
            .patch('/api/projects/2')
            .set('Cookie', `token=${invalidToken}`)


        expect(res.status).toBe(403);
    })

    it('should respond with 400 with message [Id invalide]', async () => {
        const res = await request(app)
            .patch('/api/projects/test')
            .set('Cookie', `token=${validToken}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Id invalide');
    })

    it('should call next with error when service fails', async () => {
        (prisma.project.update as jest.Mock).mockRejectedValue(new Error('DB error'));

        const res = await request(app)
            .patch('/api/projects/2')
            .set('Cookie', `token=${validToken}`);

        expect(res.status).toBe(500);
    });
})