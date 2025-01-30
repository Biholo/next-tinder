import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPhoto extends Document {
  userId: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPhotoSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photoUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const UserPhoto = mongoose.model<IUserPhoto>('UserPhoto', UserPhotoSchema);

export default UserPhoto;
