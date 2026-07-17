import {Project, Score, Skill, SkillType} from '../generated/prisma';
import prisma from "../db/prisma.client";


export const SkillsService = {

    getAll(): Promise<Skill[]> {
        return prisma.skill.findMany();
    },

    getAllByType(type: SkillType): Promise<Skill[]> {
        return prisma.skill.findMany({
            where: { type },
        });
    },

    save(label: string, type: SkillType): Promise<Skill> {
        return prisma.skill.create({
            data: {
                label,
                type
            },
        });
    },

    updateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
        return prisma.skill.update({
            where: {id},
            data
        });
    },

    deleteById(id: number): Promise<Skill> {
        return prisma.skill.delete({
            where: { id },
        });
    },
}