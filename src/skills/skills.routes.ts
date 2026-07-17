import { Router } from 'express';
import {requireAdmin, requireAuth} from "../auth/auth.middleware";
import {deleteSkill, getSkills, getSkillsByType, saveSkill, updateSkill} from "./skills.controller";

export const skillsRouter = Router();

skillsRouter.get('/:skillType', getSkillsByType);
skillsRouter.get('/', getSkills);
skillsRouter.patch('/:id', updateSkill);
skillsRouter.post('/', saveSkill);
skillsRouter.delete('/:id', requireAuth, requireAdmin, deleteSkill);