import { Document, Model, model, ObjectId, Schema } from "mongoose";
import Message from "./Message";

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
        ref: 'Message',
    }
});

chatSchema.pre('save', async function(next) {
    if(this.isModified('users') || this.isNew) {
        const lastMessage = await Message.findOne({chatId: this._id})
        .sort({time: -1})
        .exec();
        if(lastMessage) {
            this.lastMessage = lastMessage._id as ObjectId;
        }
    }
})

const Chat = model<IChat>('Chat', chatSchema);
export default Chat;