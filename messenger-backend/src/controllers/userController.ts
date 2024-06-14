import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { catchAsync } from "../utils/catchAsync";
import { deleteOne, getAll, getOne, updateOne } from "./handlerFactory";
import { AppError } from "../utils/appError";
import { ObjectId } from "mongoose";
import { createChat, getAllChatsForUser } from "./chatController";
import Chat from "../models/Chat";

export const getAllUsers = getAll(User, 'users');

export const getUser = getOne(User, '', 'user');

export const updateUser = updateOne(User, 'user');
export const deleteUser = deleteOne(User);

export const addFriend = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {id, friendId} = req.params;

    if(id === friendId) return next(new AppError('You cannot invite you as your friend', 400));
    const user = await User.findById(id);
    const friend = await User.findById(friendId)
    if(!friend) return next(new AppError('There is not user you want to add with that id', 404));
    if(!user) return next(new AppError('There is not user with that id', 404));
    
    const isAlreadyFriend = user.friends.find(f => f.toString() === friendId);
    if(isAlreadyFriend) return next(new AppError('It is already your friend', 400));

    const updatedFriends1 = [...user.friends, friend._id];
    const updatedFriends2 = [...friend.friends, user._id];
    const updatedUser1 = await User.findByIdAndUpdate(id, {friends: updatedFriends1});
    const updatedUser2 = await User.findByIdAndUpdate(friendId, {friends: updatedFriends2})

    createChat(id, friendId);
    res.status(200).json({
        status: 'success',
        updatedUser1,
        updatedUser2
    })
})

export const deleteFriend = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {id, friendId} = req.params;

    if(id === friendId) return next(new AppError('You cannot invite you as your friend', 400));
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if(!friend) return next(new AppError('There is not user you want to add with that id', 404));
    if(!user) return next(new AppError('There is not user with that id', 404));

    const isAlreadyFriend = user.friends.find(f => f.toString() === friendId);
    if(!isAlreadyFriend) return next(new AppError('Person your trying to delete is not your friend', 400));
    
    const updatedFriends1 = user.friends.filter(u => u.toString() !== friendId);
    const updatedFriends2 = friend.friends.filter(u => u.toString() !== id);
    const updatedUser1 = await User.findByIdAndUpdate(id, {friends: updatedFriends1});
    const updatedUser2 = await User.findByIdAndUpdate(friendId, {friends: updatedFriends2})

    res.status(200).json({
        status: 'success',
        updatedUser1,
        updatedUser2
    })
})

const findFriends = async (userId: ObjectId) => {
    const chatsForUser = await Chat.find({users: { $all: [userId]}});
    
    const friends = chatsForUser.map(chat => {
        const friend = chat.users.find(f => f.toString() !== userId.toString())
        return friend;
    })
    return friends;
}

export const getAllFriends = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId: ObjectId = req.user?._id as ObjectId;
    const friendsIds = await findFriends(userId);
    const promises = friendsIds.map(id => {
        return User.findById(id);
    });
    const friends = await Promise.all(promises);

    res.status(200).json({
        status: 'success',
        data: {
            friends,

        }
    })
})

export const getAllNotInFriends = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const userId: ObjectId = req.user?._id as ObjectId;
    const friends = await findFriends(userId);

    const notInFriends = await User.find({ _id: { $nin: [...friends, userId.toString()] } });

    res.status(200).json({
        status: 'success',
        data: {
            notInFriends
        }
    })
})


