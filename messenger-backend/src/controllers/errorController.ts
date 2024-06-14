import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 404);
}

const handleDuplicateErrorDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please use another value`;

    return new AppError(message, 400);
}

const handleValidationError = (err: any) => {
    const errors = Object.values(err.errors)
    .map((obj: any) => obj.message);

    const message = `Invalid input data ${errors.join(', ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Pleae log in again', 401);

const handleJWTExpired = () => new AppError('Your token has expired. please log in again', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
    console.log(err);

    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
    if(err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong'
    })
}

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err instanceof AppError);

    err.statusCode = err.statusCode || 500;
    err.status= err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, req, res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err};
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateErrorDB(error);
        if (error.name === 'ValidationError') error = handleValidationError(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpired();

        sendErrorProd(error, req, res);
    }

}