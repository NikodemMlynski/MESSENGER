type EmoticonType = 'sad' | 'happy' | 'angry' | 'sigma';

interface IMessage {
    _id: string;
    chatId: string;
    sender: string;
    receiver: string;
    content: string;
    time: Date;
    read: boolean;
    isYourMessage?: boolean;
    react?: EmoticonType;
}

export default IMessage;