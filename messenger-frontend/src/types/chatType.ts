
interface User {
    _id: string;
    username: string;
}
interface IChat {
    _id: string;
    users: User[];
    lastMessage?: string;
}

export default IChat;