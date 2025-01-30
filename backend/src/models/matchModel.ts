import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
    user1_id: string;
    user2_id: string;
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema = new Schema({
    user1_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user2_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const MatchModel = mongoose.model<IMatch>('Match', MatchSchema);

export default MatchModel;
