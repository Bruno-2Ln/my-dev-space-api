import {NextFunction, Request, Response} from "express";
import {SkillsService} from "./skills.service";
import {Prisma, SkillType} from '../generated/prisma';


export const getSkills = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await SkillsService.getAll());
    } catch (err) {
        next(err);
    }
};

export const getSkillsByType = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        res.status(200).json(await SkillsService.getAllByType(_req.params.skillType as SkillType));
    } catch (err) {
        next(err);
    }
};

export const saveSkill = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { label, skillType } = req.body;

        if (!label) {
            res.status(400).json({ message: 'label is required' });
            return;
        }
        if (!skillType) {
            res.status(400).json({ message: 'skill type is required' });
            return;
        }

        res.status(201).json(await SkillsService.save(label, skillType));
    } catch (e) {
        next(e)
    }
}

export const updateSkill = async (
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

        res.status(200).json(await SkillsService.updateSkill(id, req.body));
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
            res.status(404).json({ message: 'project not existing' });
            return;
        }
        next(e);
    }
}

export const deleteSkill = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        res.status(200).json(await SkillsService.deleteById(id));
    } catch (err) {
        res.status(404).json({ message: 'skill not existing' });
    }
};