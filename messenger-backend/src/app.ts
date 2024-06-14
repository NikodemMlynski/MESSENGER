import express, { NextFunction, Request, Response } from 'express';
import { Application } from 'express';
import indexRotes from './routes/indexRoutes';
import { AppError } from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import dotenv from 'dotenv';
import path from 'path'; // Importuj moduł path
import cors from 'cors';
// Ustaw ścieżkę do pliku .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });



const app: Application = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use('/', indexRotes);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

export default app;