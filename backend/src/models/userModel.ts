import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: string[];
  refreshToken?: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  gender: string;
  dateOfBirth: Date;
  location: string;
  bio: string;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ["ROLE_CLIENT"] },
  refreshToken: { type: String },
  profilePictureUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  dateOfBirth: { type: Date },
  location: { type: String },
  bio: { type: String },
  preferences: { 
    gender: { type: String, enum: ['male', 'female', 'both'], default: 'both' },
    ageRange: { type: Object, default: { min: 18, max: 100 } },
  },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
