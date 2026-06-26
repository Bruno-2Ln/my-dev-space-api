import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { scoresRouter } from './scores/scores.routes';
import { errorMiddleware } from './middleware/error.middleware';
import cookieParser from "cookie-parser";
import {authRouter} from "./auth/auth.routes";
import helmet from 'helmet';

dotenv.config();

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
};

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());
app.use('/api/auth', authRouter);
app.use('/api/scores', scoresRouter);

app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;