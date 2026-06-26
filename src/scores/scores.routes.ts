import { Router } from 'express';
import {getScores, getScoresByGame, saveScore, deleteScore} from './scores.controller';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';

export const scoresRouter = Router();

scoresRouter.get('/', getScores);
scoresRouter.get('/:gameName', getScoresByGame);
scoresRouter.post('/', saveScore);
scoresRouter.delete('/:id', requireAuth, requireAdmin, deleteScore);