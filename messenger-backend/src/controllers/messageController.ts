import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import User from "../models/User";
import Message from "../models/Message";
import IMessage from "../models/messageType";
import { ObjectId } from "mongoose";
import { AppError } from "../utils/appError";
import Chat from "../models/Chat";
import IUser from "../models/userType";
import { deleteOne, updateOne } from "./handlerFactory";

export const sendMessage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const sender = req.user;
    const receiver = await User.findById(id);
    console.log(sender?._id);
    console.log(receiver?._id);
    const {content} = req.body;
    if(!sender) return next(new AppError('Sender is not defined', 400));
    if(!receiver) return next(new AppError('Receiver is not defined', 400));

    const chat = await Chat.findOne({users: { $all: [sender._id, receiver._id] }})
    // console.log(chat);
    if(!chat) return next(new AppError('Person you trying to send message is not yet tour friend', 400));
    const messageObj = {
        sender: sender._id as ObjectId,
        receiver: receiver._id as ObjectId,
        content,
        chatId: chat._id as ObjectId
    };
    
    const message = await Message.create(messageObj) as IMessage;

    res.status(200).json({
        status: 'success',
        message
    });
})

export const getMessagesForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const messages = await Message.find({sender: user?._id});

    res.status(200).json({
        status: 'success',
        results: messages.length,
        data: {
            messages
        }
    })
});

export const getMessagesInChat = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {chatId} = req.params;
    const messagesInChat = await Message.find({chatId});
    const userId = req.user?._id as ObjectId;
   
    if(messagesInChat.length < 1) {
        return res.status(200).json({
            status: 'success',
            yourMessages: [],
            friendMessages: [],
        })
    }

    const convertedUserId = userId.toString();
    const receiverId = messagesInChat[0]?.receiver.toString();
    const senderId = messagesInChat[0]?.sender.toString();

    if(
        convertedUserId !== receiverId &&
        convertedUserId !== senderId
    ) return next(new AppError('This chat does not belong to you', 400))

    const yourMessages = messagesInChat.filter(message => message.sender.toString() === convertedUserId);
    const friendMessages = messagesInChat.filter(message => message.receiver.toString() === convertedUserId);
    
    res.status(200).json({
        status: 'success',
        numberOfYourMessages: yourMessages.length,
        numberOfFriendMessages: friendMessages.length,
        yourMessages,
        friendMessages
    })
});

export const updateMessage = updateOne(Message, 'updatedMessage');

export const deleteMessage = deleteOne(Message);

