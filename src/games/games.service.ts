import {Game} from '../generated/prisma';
import prisma from "../db/prisma.client";

export const GamesService = {
    getAllGames(): Promise<Game[]> {
        return prisma.game.findMany({
            orderBy: [
                { order: 'asc' },
                { id: 'asc' }
            ]
        });
    },

    save(data: {name: string, label: number, available: boolean, description?: string}): Promise<Game> {
        return prisma.game.create({data});
    },

    updateGame(id: number, data: Partial<Game>): Promise<Game> {
        return prisma.game.update({
            where: {id},
            data
        });
    },

    deleteById(id: number): Promise<Game> {
        return prisma.game.delete({
            where: { id },
        });
    },

    getAllWithScores(): Promise<Game[]> {
        return prisma.game.findMany({
            include: { scores: true },
            orderBy: { order: 'asc' },
        });
    },

    getByINameWithScores(name: string): Promise<Game | null> {
        return prisma.game.findUnique({
            where: { name },
            include: {
                scores: {
                    orderBy: { score: 'desc' },
                    take: 10,
                },
            },
        });
    }


}