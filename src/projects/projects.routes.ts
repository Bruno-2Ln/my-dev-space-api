import {deleteProject, getProjects, saveProject, updateProject} from "./projects.controller";
import {Router} from "express";
import {requireAdmin, requireAuth} from "../auth/auth.middleware";

export const projectsRouter = Router();

projectsRouter.post('/', requireAuth, requireAdmin, saveProject);
projectsRouter.patch('/:id', requireAuth, requireAdmin, updateProject);
projectsRouter.get('/', getProjects);
projectsRouter.delete('/:id', requireAuth, requireAdmin, deleteProject);