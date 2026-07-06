import { Request, Response, NextFunction} from "express";
import { ProjectsService } from './projects.service';

export const getProjects = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await ProjectsService.getAllProjects())
    } catch (error) {
        next(error);
    }
}

export const getProjectById = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(_req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Id invalide' });
            return;
        }

        res.status(200).json(await ProjectsService.getProjectById(id));
    } catch (e) {
        next(e)
    }
}

export const saveProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, } = req.body;

        if (!title) {
            res.status(400).json({ message: 'title is required' });
            return;
        }

        res.status(201).json(await ProjectsService.saveProject(req.body));
    } catch (e) {
        next(e)
    }
}

export const updateProject = async (
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

        res.status(200).json(await ProjectsService.updateProject(id, req.body));
    } catch (e) {
        next(e)
    }
}

export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        res.status(200).json(await ProjectsService.deleteProjectById(id));
    } catch (err) {
        res.status(404).json({ message: 'project not existing' });
    }
};