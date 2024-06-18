import { Document, model, Schema } from "mongoose";
import IMessage from "./messageType";
import Chat from "./Chat";



const messageSchema = new Schema<IMessage>({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    react: {
        type: String,
    }
});

messageSchema.post('save', async function(doc, next) {
    await Chat.findByIdAndUpdate(doc.chatId, { lastMessage: doc._id });
    next();
});

const Message = model<IMessage>('Message', messageSchema);

export default Message;