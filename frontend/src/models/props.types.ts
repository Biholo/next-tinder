import type { User } from './user.types';

export interface CardProps {
    user: User;
    onSwipe: (direction: 'left' | 'right') => void;
}

export interface ChatProps {
    matchId: string;
    onClose: () => void;
}