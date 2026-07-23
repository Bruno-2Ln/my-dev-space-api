import {Game} from '../generated/prisma';
import prisma from "../db/prisma.client";

export const GamesService = {
    getAllGames(): Promise<Game[]> {
        return prisma.game.findMany({
            orderBy: [
                {available: 'desc'},
                {order: 'asc'},
                {id: 'asc'}
            ]
        });
    },

    save(data: { name: string, label: number, available: boolean, description?: string }): Promise<Game> {
        return prisma.game.create({data});
    },

    getById(id: number): Promise<Game | null> {
        return prisma.game.findUnique({
            where: {id},
        });
    },

    getByIdWithScores(id: number): Promise<Game | null> {
        return prisma.game.findUnique({
            where: {id},
            include: {
                scores: {
                    orderBy: {score: 'desc'},
                    take: 10,
                },
            },
        });
    },

    updateGame(id: number, data: Partial<Game>): Promise<Game> {
        return prisma.game.update({
            where: {id},
            data
        });
    },

    deleteById(id: number): Promise<Game> {
        return prisma.game.delete({
            where: {id},
        });
    },

    getAllWithScores(): Promise<Game[]> {
        return prisma.game.findMany({
            include: {
                scores: {
                    orderBy: {score: 'desc'},
                },
            },
            orderBy: [
                {available: 'desc'},
                {order: 'asc'}],
        });
    },

    getByName(name: string): Promise<Game | null> {
        return prisma.game.findUnique({
            where: {name},
        });
    },

    getByNameWithScores(name: string): Promise<Game | null> {
        return prisma.game.findUnique({
            where: {name},
            include: {
                scores: {
                    orderBy: {score: 'desc'},
                    take: 10,
                },
            },
        });
    }


}