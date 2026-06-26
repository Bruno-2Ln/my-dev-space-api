import { Request, Response, NextFunction } from 'express';
import { ScoresService } from './scores.service';



export const getScores = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await ScoresService.getAll());
    } catch (err) {
        next(err);
    }
};

export const getScoresByGame = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await ScoresService.getAllByGame(_req.params.gameName));
    } catch (err) {
        next(err);
    }
};

export const saveScore = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { playerName, score, gameName } = req.body;

        if (!playerName || typeof playerName !== 'string') {
            res.status(400).json({ message: 'playerName is required' });
            return;
        }

        if (!score || typeof score !== 'number') {
            res.status(400).json({ message: 'score must be a number' });
            return;
        }

        res.status(201).json(await ScoresService.save(playerName, score, gameName ?? 'snake'));
    } catch (err) {
        next(err);
    }
};

export const deleteScore = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        res.status(200).json(await ScoresService.deleteById(id));
    } catch (err) {
        res.status(404).json({ message: 'score not existing' });
    }
};