
interface User {
    _id: string;
    username: string;
}
interface ILastMessage {
    content: string;
    _id: string;
}
interface IChat {
    _id: string;
    users: User[];
    lastMessage?: ILastMessage;
}

export default IChat;