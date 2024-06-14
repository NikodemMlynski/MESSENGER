import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import IUser from "./userType";

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        valitate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Pleaes provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(this: IUser, el: string): boolean {
                return el == this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
});

userSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if(!user.isModified('password')) return next();

    user.password = await bcrypt.hash(user.password, 12);

    user.passwordConfirm = undefined;

    next();
})
userSchema.methods.correctPassword = async function (
    candidatePassword: string,
    userPassword: string,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = model<IUser>('User', userSchema);
export default User;
