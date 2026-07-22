import {Router} from "express";
import {
    getGames,
    getGamesWithScores,
    saveGame,
    updateGame,
    deleteGame,
    getGameByNameWithScores
} from './games.controller';
import {requireAdmin, requireAuth} from "../auth/auth.middleware";

export const gamesRouter = Router();

gamesRouter.get('/', getGames);
gamesRouter.get('/scores', getGamesWithScores);
gamesRouter.get('/:name', getGameByNameWithScores);
gamesRouter.post('/', requireAuth, requireAdmin, saveGame);
gamesRouter.patch('/:id', requireAuth, requireAdmin, updateGame);
gamesRouter.delete('/:id', requireAuth, requireAdmin, deleteGame);