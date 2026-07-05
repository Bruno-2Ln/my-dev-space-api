
import {ScoresService} from "./scores.service"

import prisma from '../db/prisma.client';

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        score: {
            findMany: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }
    }
}));

describe('ScoresService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return scores sorted by score desc', async () => {
            // Arrange — on dit ce que Prisma va retourner
            (prisma.score.findMany as jest.Mock).mockResolvedValue([
                { id: 1, playerName: 'Bruno', score: 150, gameName: 'snake', createdAt: new Date() },
                { id: 2, playerName: 'Alice', score: 100, gameName: 'snake', createdAt: new Date() },
            ]);

            // Act — on appelle le service
            const scores = await ScoresService.getAll();

            // Assert — on vérifie
            expect(scores).toHaveLength(2);
            expect(prisma.score.findMany).toHaveBeenCalledWith({
                orderBy: { score: 'desc' },
                take: 10,
            });
        });

        it('should return scores sorted by score desc with game name', async () => {
            (prisma.score.findMany as jest.Mock).mockResolvedValue([
                { id: 1, playerName: 'Bruno', score: 150, gameName: 'snake', createdAt: new Date() },
                { id: 2, playerName: 'Alice', score: 100, gameName: 'snake', createdAt: new Date() },
            ]);

            const scores = await ScoresService.getAllByGame('snake');

            expect(scores).toHaveLength(2);
            expect(prisma.score.findMany).toHaveBeenCalledWith({
                where: { gameName: 'snake' },
                orderBy: { score: 'desc' },
                take: 10,
            });
        });

        it('should return empty array', async () => {
            (prisma.score.findMany as jest.Mock).mockResolvedValue([]);

            const scores = await ScoresService.getAll();

            expect(scores).toHaveLength(0);
            expect(prisma.score.findMany).toHaveBeenCalledWith({
                orderBy: { score: 'desc' },
                take: 10,
            });
        });

        it('should return new score', async () => {

            (prisma.score.create as jest.Mock).mockResolvedValue(
                { id: 1, playerName: 'Bruno', score: 150, gameName: 'snake', createdAt: new Date() },
            );

            const newScore = await ScoresService.save('Bruno', 150,'snake');

            expect(newScore).toHaveProperty('id');
            expect(newScore).toHaveProperty('playerName', 'Bruno');

        });

        it('should return new score with default GameName', async () => {

            (prisma.score.create as jest.Mock).mockResolvedValue(
                { id: 1, playerName: 'Bruno', score: 150,  gameName: 'snake', createdAt: new Date() },
            );

            const newScore = await ScoresService.save('Bruno', 150);
            expect(newScore).toHaveProperty('gameName', 'snake');
            expect(prisma.score.create).toHaveBeenCalledWith({
                data: {
                    playerName: 'Bruno',
                    score: 150,
                    gameName: 'snake',
                }
            });

        });

    });

    it('delete score successfully', async () => {
        (prisma.score.delete as jest.Mock).mockResolvedValue(
            { id: 1, playerName: 'Bruno', score: 150 },
        );

        const deleteScore = await ScoresService.deleteById(1);

        expect(deleteScore).toHaveProperty('id', 1);
        expect(prisma.score.delete).toHaveBeenCalledWith({
           where: { id: 1 },
        });
    })

    it('should throw an error when score does not exist', async () => {
        (prisma.score.delete as jest.Mock).mockRejectedValue(new Error('Record not found'));

        await expect(ScoresService.deleteById(999)).rejects.toThrow('Record not found');
    });
});
