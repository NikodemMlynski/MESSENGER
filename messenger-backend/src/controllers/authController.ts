import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import IUser from "../models/userType";
import jwt, {Secret, SignOptions } from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import { promisify } from "util";

interface SignUpUserData {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const signToken = (id: ObjectId) => {
    const secret: Secret = process.env.JWT_SECRET as string;
    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
    return jwt.sign({ id }, secret, options);
}

const createSentToken = (user: IUser, statusCode: number, res: Response) => {
    const token = signToken(user._id as ObjectId);

    user.password = '';

    res.status(statusCode).json({
        statu: 'success',
        token,
        data: {
            user
        }
    })
}

interface DecodedToken {
    id: string;
    iat: number;
}

const verifyToken = (token: string, secret: string): Promise<DecodedToken> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                return reject(err);
            }
            resolve(decoded as DecodedToken);
        })
    })
}

export const protect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ){
            token = req.headers.authorization.split(' ')[1]
        }
        if(!token) {
            return next(new AppError('You are not logged in! Please log in to get access to this route', 401))
        }

        const decoded = await verifyToken(token, process.env.JWT_SECRET as string);
        if(!decoded){
            return next(new AppError('Invalid token please log in again', 401))
        }

        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            return next(new AppError('The user belonging to this token no longer exists', 401));
        }
        req.user = currentUser; // trzeba do naprawić odpowiedź jest na chacie gpt w ostatnim chacie
        res.locals.user = currentUser;
        next();

    }
    
)

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {
        username,
        email,
        password,
        passwordConfirm
    }: SignUpUserData = req.body;

    const user = await User.create({username, email, password, passwordConfirm});
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
})

export const signIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and passwrd', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }
    createSentToken(user, 200, res);
    
    
})