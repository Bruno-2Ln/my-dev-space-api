import { Router } from 'express';
import {getScores, saveScore, deleteScore, getScoresByIdentifier} from './scores.controller';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';

export const scoresRouter = Router();

scoresRouter.get('/', getScores);
scoresRouter.get('/:identifier', getScoresByIdentifier);
scoresRouter.post('/', saveScore);
scoresRouter.delete('/:id', requireAuth, requireAdmin, deleteScore);