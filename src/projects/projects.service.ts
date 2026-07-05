import {Project} from '../generated/prisma';
import prisma from "../db/prisma.client";

export const ProjectsService = {

    getAllProjects(): Promise<Project[]> {
        return prisma.project.findMany({
            orderBy: [
                { order: 'asc' },
                { id: 'asc' }
            ]
        });
    },

    //todo : getAllByStack

    saveProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        return prisma.project.create({
            data
        });
    },

    updateProject(id: number, data: Partial<Project>): Promise<Project> {
        return prisma.project.update({
            where: {id},
            data
        });
    },

    deleteProjectById(id: number): Promise<Project> {
        return prisma.project.delete({
            where: { id }
        })
    }
}