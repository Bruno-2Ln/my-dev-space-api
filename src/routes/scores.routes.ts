import { Router } from 'express';
import {getScores, getScoresByGame, saveScore} from '../controllers/scores.controller';

export const scoresRouter = Router();

scoresRouter.get('/', getScores);
scoresRouter.get('/:gameName', getScoresByGame);
scoresRouter.post('/', saveScore);