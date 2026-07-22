import {NextFunction, Request, Response} from "express";
import {GamesService} from "./games.service";
import { Prisma } from '../generated/prisma';


export const getGames = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await GamesService.getAllGames())
    } catch (error) {
        next(error);
    }
}

export const getGamesWithScores = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await GamesService.getAllWithScores())
    } catch (error) {
        next(error);
    }
}

export const getGameWithScoresByIdentifier = async (req, res, next) => {
    const { identifier } = req.params;
    const game = !isNaN(Number(identifier))
        ? await GamesService.getByIdWithScores(Number(identifier))
        : await GamesService.getByNameWithScores(identifier);

    if (!game) { res.status(404).json({ message: 'Game not found' }); return; }
    res.status(200).json(game);
};

// export const getGameByNameWithScores = async (
//     _req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const name = _req.params.name;
//
//
//         res.status(200).json(await GamesService.getByNameWithScores(name));
//     } catch (e) {
//         next(e)
//     }
// }

export const getGameByIdentifier = async (req, res, next) => {
    const { identifier } = req.params;
    const game = !isNaN(Number(identifier))
        ? await GamesService.getById(Number(identifier))
        : await GamesService.getByName(identifier);

    if (!game) { res.status(404).json({ message: 'Game not found' }); return; }
    res.status(200).json(game);
};

export const getGameById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Id invalide' });
            return;
        }

        res.status(200).json(await GamesService.getById(id));
    } catch (e) {
        next(e);
    }
}
// export const getGameByIdWithScores = async (
//     _req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void> => {
//     try {
//         const id = Number(_req.params.id);
//         res.status(200).json(await GamesService.getByIdWithScores(id));
//     } catch (e) {
//         next(e)
//     }
// }


export const saveGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, label, available = false, description, order = 0 } = req.body;

        if (!name || typeof name !== 'string') {
            res.status(400).json({ message: 'Name is required' });
            return;
        }

        if (!label || typeof label !== 'string') {
            res.status(400).json({ message: 'Label is required' });
            return;
        }


        res.status(201).json(await GamesService.save({ name, label, available, description  }));
    } catch (err) {
        next(err);
    }
};

export const updateGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Id invalide' });
            return;
        }

        res.status(200).json(await GamesService.updateGame(id, req.body));
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            res.status(404).json({ message: 'game not existing' });
            return;
        }
        next(e);
    }
}

export const deleteGame = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        res.status(200).json(await GamesService.deleteById(id));
    } catch (err) {
        res.status(404).json({ message: 'game not existing' });
    }
};