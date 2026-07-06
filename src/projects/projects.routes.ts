import {deleteProject, getProjects, saveProject, updateProject, getProjectById} from "./projects.controller";
import {Router} from "express";
import {requireAdmin, requireAuth} from "../auth/auth.middleware";

export const projectsRouter = Router();

projectsRouter.post('/', requireAuth, requireAdmin, saveProject);
projectsRouter.patch('/:id', requireAuth, requireAdmin, updateProject);
projectsRouter.get('/', getProjects);
projectsRouter.get('/:id', getProjectById);
projectsRouter.delete('/:id', requireAuth, requireAdmin, deleteProject);