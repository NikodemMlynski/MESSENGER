import { Schema, Document } from "mongoose";

interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    createdAt: Date;
    friends: Schema.Types.ObjectId[];
    photo: string;
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
}

export default IUser;