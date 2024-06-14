interface IUser {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    photo?: string;
}

export default IUser;