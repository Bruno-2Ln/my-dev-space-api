import { Score } from '../generated/prisma';
import prisma from '../db/prisma.client';
import {GameType} from "../models/game.model";


export const ScoresService = {

    getAll(): Promise<Score[]> {
        return prisma.score.findMany({
            orderBy: { score: 'desc' },
            take: 10,
        });
    },

    getAllByGame(gameName: GameType): Promise<Score[]> {
        return prisma.score.findMany({
            where: { game: {
                    name: gameName
                } },
            include: { game: true },
            orderBy: { score: 'desc' },
            take: 10,
        });
    },

    save(playerName: string, score: number, gameName = 'snake'): Promise<Score> {
        return prisma.score.create({
            data: {
                playerName,
                score,
                game: {
                    connect: { name: gameName }
                }
            },
        });
    },

    deleteById(id: number): Promise<Score> {
        return prisma.score.delete({
            where: { id },
        });
    },

};