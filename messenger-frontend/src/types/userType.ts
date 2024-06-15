interface IUser {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    photo?: string;
}

export default IUser;

export interface ILoggedUser {
    token: string;
    email: string;
    friends: string[],
    username: string;
    id: string;
}
export interface IUserGet {
    _id: string;
    username: string;
    email: string;
    password?: string;
    passwordConfirm?: string;
    createdAt: Date;
    friends: string[];
    photo?: string;
}
