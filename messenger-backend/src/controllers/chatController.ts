import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import IUser from "../models/userType";
import { ObjectId } from "mongoose";
import Chat from "../models/Chat";
import { getAll, getOne } from "./handlerFactory";

export const createChat = async (user1Id: string, user2Id: string) => {
    const users = [user1Id, user2Id]
    const createdValue = Chat.create({users});
    return createdValue;
}
export const deleteChat = async (user1Id: string, user2Id: string) => {
    const users = [user1Id, user2Id];
    
    try {
        const result = await Chat.findOneAndDelete({
            users: { $all: users }
        });

        if (result) {
            console.log('Chat deleted successfully:', result);
        } else {
            console.log('No chat found for the given users.');
        }
    } catch (error) {
        console.error('Error deleting chat:', error);
    }
};

export const getAllChatsForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const chatsForUser = await Chat.find({users: { $all: [req.user?._id]}}).populate({
        path: 'users',
        select: 'username'
    });

    res.status(200).json({
        status: 'success',
        results: chatsForUser.length,
        chats: chatsForUser
    })
})

// export const getAllChatsForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // if (!req.user) {
    //     return next(new AppError('User not authenticated', 401));
    // }

    // const userId = req.user._id;

    // const chatsForUser = await Chat.find({ users: userId })
    //     .populate({
    //         path: 'users',
    //         select: 'username' // Specify the fields you want to retrieve
    //     });

    // res.status(200).json({
    //     status: 'success',
    //     results: chatsForUser.length,
    //     chats: chatsForUser
    // });
// });
        
export const getAllChats = getAll(Chat, 'chats');
export const getChat = getOne(Chat, '', 'chat');