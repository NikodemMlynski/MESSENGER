import { Document, Model, model, Schema } from "mongoose";

interface IChat extends Document{
    users: Schema.Types.ObjectId[],
    lastMessage: Schema.Types.ObjectId,   
}

const chatSchema = new Schema<IChat>({
    users: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            length: 2,
            ref: 'User',
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Messages',
    }
});

const Chat = model<IChat>('Chat', chatSchema);
export default Chat;