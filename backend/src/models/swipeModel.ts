import mongoose, { Schema, Document } from 'mongoose';

export interface ISwipe extends Document {
    userId: string;
    targetId: string;
    swipeType: string;
    direction: 'LIKE' | 'DISLIKE';
    createdAt: Date;
    updatedAt: Date;
}

const SwipeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    swipeType: { type: String, enum: ['LIKE', 'DISLIKE'], required: true },
    direction: { type: String, enum: ['LIKE', 'DISLIKE'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Swipe = mongoose.model<ISwipe>('Swipe', SwipeSchema);

export default Swipe;
