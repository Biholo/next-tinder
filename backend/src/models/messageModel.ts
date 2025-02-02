import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    _id: string;
    matchId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    updatedAt: Date;
}

const MessageSchema = new Schema({
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
