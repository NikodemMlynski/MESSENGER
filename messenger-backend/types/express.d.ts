import IUser from "../src/models/userType";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}