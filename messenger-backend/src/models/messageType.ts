import { Document, Schema } from "mongoose";

interface IMessage extends Document {
    chatId: Schema.Types.ObjectId;
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    content: string;
    time?: Date;
    read?: boolean;
    react?: string;
}
export default IMessage;