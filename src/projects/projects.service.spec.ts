import prisma from "../db/prisma.client";
import {ScoresService} from "../scores/scores.service";
import {ProjectsService} from "./projects.service";

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        project: {
            findMany: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        }
    }
}));

describe('projectsService', () => {
    const mockProjects = [
        { id: 1, title: 'Snake', shortDescription: 'Jeu Snake', description: 'Un jeu Snake en Angular', thumbnailUrl: null, images: [], stack: ['ANGULAR'], featured: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, title: 'BFF Bancaire', shortDescription: 'API bancaire', description: 'Backend sécurisé Node.js', thumbnailUrl: null, images: [], stack: ['NODEJS'], featured: false, order: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, title: 'Portfolio', shortDescription: 'Mon portfolio', description: 'Portfolio Angular + Node', thumbnailUrl: null, images: [], stack: ['ANGULAR', 'NODEJS'], featured: false, order: 1, createdAt: new Date(), updatedAt: new Date() },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return projects sorted by order asc and id asc if is same order', async () => {
            (prisma.project.findMany as jest.Mock).mockResolvedValue([
                ...mockProjects
            ]);
            const projects = await ProjectsService.getAllProjects();
            expect(projects).toHaveLength(3);
            expect(prisma.project.findMany).toHaveBeenCalledWith({
                orderBy: [
                    { order: 'asc' },
                    { id: 'asc' }
                ]
            });
        });
    });

    it('save project successfully', async () => {
        (prisma.project.create as jest.Mock).mockResolvedValue(
            { id: 1, title: 'Snake', shortDescription: 'Jeu Snake', description: 'Un jeu Snake en Angular', thumbnailUrl: null, images: [], stack: ['ANGULAR'], featured: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
        );

        const newProject = await ProjectsService.saveProject( {title: 'Snake', shortDescription: 'Jeu Snake', description: 'Un jeu Snake en Angular', thumbnailUrl: null, images: [], stack: ['ANGULAR'], featured: true, order: 1 });

        expect(newProject).toHaveProperty('id');
        expect(newProject).toHaveProperty('title', 'Snake');
    });

    it('update project successfully', async () => {
        const updated = { ...mockProjects[0], title: 'Snake Update' };
        (prisma.project.update as jest.Mock).mockResolvedValue(updated);

        const result = await ProjectsService.updateProject(1, { title: 'Snake Update' });

        expect(result).toHaveProperty('title', 'Snake Update');
        expect(prisma.project.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { title: 'Snake Update' },
        });
    });

    it('delete project successfully', async () => {
        (prisma.project.delete as jest.Mock).mockResolvedValue(
            { id: 1, title: 'Snake', shortDescription: 'Jeu Snake', description: 'Un jeu Snake en Angular', thumbnailUrl: null, images: [], stack: ['ANGULAR'], featured: true, order: 1, createdAt: new Date(), updatedAt: new Date() },
        );

        const deleteProject = await ProjectsService.deleteProjectById(1);

        expect(deleteProject).toHaveProperty('id', 1);
        expect(prisma.project.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    })
})