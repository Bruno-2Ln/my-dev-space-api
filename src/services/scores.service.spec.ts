
import {ScoresService} from "./scores.service"

import prisma from '../db/prisma.client';

jest.mock('../db/prisma.client', () => ({
    __esModule: true,
    default: {
        score: {
            findMany: jest.fn(),
            create: jest.fn(),
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

        it('should return empty array', async () => {
            // Arrange — on dit ce que Prisma va retourner
            (prisma.score.findMany as jest.Mock).mockResolvedValue([]);

            // Act — on appelle le service
            const scores = await ScoresService.getAll();

            // Assert — on vérifie
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

            console.log(newScore)

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
});
