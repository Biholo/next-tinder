import jwt from 'jsonwebtoken';
import { IUser } from '@/models/userModel';

interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email 
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '24h' }
  );
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
